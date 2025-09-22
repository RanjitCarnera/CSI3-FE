import { graphql } from "babel-plugin-relay/macro";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useFragment, useMutation } from "react-relay";
import type { CUCFieldRef } from "@components/cuc-field/cuc-field.types";
import {
	convertCUCToMarkerInputs,
	convertMarkerInputsToCUCInput,
} from "@components/cuc-field/cuc-field.utils";
import { selectActiveFeatureToggleIds } from "@redux/feature-toggles";
import type { SetTagsInputInput } from "@relay/CreateAssignmentButton_CreateMutation.graphql";
import { type EditAssignmentButton_CUCInlineFragment$key } from "@relay/EditAssignmentButton_CUCInlineFragment.graphql";
import { type EditAssignmentButton_SetAssignmentCUCMutation } from "@relay/EditAssignmentButton_SetAssignmentCUCMutation.graphql";
import { type EditAssignmentButton_AssignmentFragment$key } from "../../__generated__/EditAssignmentButton_AssignmentFragment.graphql";
import { type EditAssignmentButton_EditMutation } from "../../__generated__/EditAssignmentButton_EditMutation.graphql";
import { type EditAssignmentButton_ProjectFragment$key } from "../../__generated__/EditAssignmentButton_ProjectFragment.graphql";
import { EditAssignmentForm, type EditAssignmentFormState } from "../ui/EditAssignmentForm";
import { SuspenseDialogWithState } from "../ui/SuspenseDialogWithState";
import { TkButtonLink } from "../ui/TkButtonLink";

const PROJECT_FRAGMENT = graphql`
	fragment EditAssignmentButton_ProjectFragment on Project {
		id
		...EditAssignmentForm_ProjectFragment
	}
`;

const EDIT_MUTATION = graphql`
	mutation EditAssignmentButton_EditMutation($input: EditAssignmentInput!) {
		Scenario {
			editAssignment(input: $input) {
				assignment {
					...EditAssignmentButton_AssignmentFragment
				}
				update {
					scenario {
						...AssignmentCard_ScenarioFragment

						utilizationWithStandAndEndDate {
							...personCard_ScenarioUtilizationFragment
						}
					}
				}
			}
		}
	}
`;

const SET_ASSIGNMENT_CUC_MUTATION = graphql`
	mutation EditAssignmentButton_SetAssignmentCUCMutation($input: SetAssigmentCUCInput!) {
		Assignment {
			setAssigmentCUC(input: $input) {
				assignment {
					...EditAssignmentButton_AssignmentFragment
				}
			}
		}
	}
`;

const ASSIGNMENT_FRAGMENT = graphql`
	fragment EditAssignmentButton_AssignmentFragment on Assignment {
		id
		startDate
		endDate
		person {
			id
		}
		validAssignmentRoles {
			id
			cucTemplate {
				cuc {
					...EditAssignmentButton_CUCInlineFragment
				}
			}
		}
		importId
		isExecutive
		comment
		weight
		tags {
			id
			data {
				name
				color
			}
		}
		cuc {
			...EditAssignmentButton_CUCInlineFragment
		}
		weightToDay
		...EditAssignmentForm_AssignmentFragment
	}
`;

export const CUC_INLINE_FRAGMENT = graphql`
	fragment EditAssignmentButton_CUCInlineFragment on CUC @inline {
		markers {
			kind
			percentageOfWeighting
			... on SimpleMarker {
				percentageInTime
				name
			}
			... on CustomMarker {
				percentageInTime
				name
			}
			... on MilestoneMarker {
				percentageInTime
				assignmentRef
				milestone {
					id
					data {
						name
						date
					}
				}
			}
			... on MilestoneTemplateMarker {
				milestoneTemplate {
					data {
						timeInPercent
						name
					}
					id
				}
			}
		}
	}
`;

interface OwnProps {
	className?: string;
	assignmentFragmentRef: EditAssignmentButton_AssignmentFragment$key;
	projectFragmentRef: EditAssignmentButton_ProjectFragment$key;
}

export const EditAssignmentButton = ({
	className,
	assignmentFragmentRef,
	projectFragmentRef,
}: OwnProps) => {
	const activeFeatureToggleIds = useSelector(selectActiveFeatureToggleIds);
	const hasActiveCUCFeatureToggle = activeFeatureToggleIds.includes("CUC");

	const [isVisible, setVisible] = useState(false);
	const assignment = useFragment<EditAssignmentButton_AssignmentFragment$key>(
		ASSIGNMENT_FRAGMENT,
		assignmentFragmentRef,
	);
	const project = useFragment<EditAssignmentButton_ProjectFragment$key>(
		PROJECT_FRAGMENT,
		projectFragmentRef,
	);
	const [commitEdit] = useMutation<EditAssignmentButton_EditMutation>(EDIT_MUTATION);
	const [commitSetCUC] = useMutation<EditAssignmentButton_SetAssignmentCUCMutation>(
		SET_ASSIGNMENT_CUC_MUTATION,
	);

	const cucOpt = assignment?.cuc
		? readInlineData<EditAssignmentButton_CUCInlineFragment$key>(
				CUC_INLINE_FRAGMENT,
				assignment?.cuc,
		  )
		: undefined;

	return (
		<>
			<TkButtonLink
				className={className}
				icon="pi pi-pencil"
				iconPos="left"
				label="Edit"
				onClick={() => {
					setVisible(true);
				}}
			/>

			<SuspenseDialogWithState<EditAssignmentFormState, CUCFieldRef>
				title={"Create assignment"}
				isVisible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
				formComponent={(ref, onHide) => {
					return (
						<div>
							<EditAssignmentForm
								ref={ref}
								assignmentFragmentRef={assignment}
								projectFragmentRef={project}
								weightToday={assignment.weightToDay}
								initialState={{
									personRef: assignment?.person?.id,
									startDate: assignment?.startDate,
									endDate: assignment?.endDate,
									validAssignmentRolesRef: assignment?.validAssignmentRoles.map(
										(r) => r.id,
									),
									importId: assignment?.importId || undefined,
									isExecutive: assignment?.isExecutive,
									comment: assignment?.comment || undefined,
									weight: assignment?.weight || undefined,
									setTagsInput: assignment.tags.map((e) => ({
										name: e.data.name,
										color: e.data.color,
										id: e.id,
									})),
									cuc: convertCUCToMarkerInputs(cucOpt),
								}}
								onSubmit={(values, { setSubmitting }) => {
									const setTagsInput: Writable<SetTagsInputInput> = {
										tagNames: [],
										tagsRef: [],
									};
									values.setTagsInput.forEach((tag) => {
										if (tag.id) return setTagsInput.tagsRef.push(tag.id);
										else setTagsInput.tagNames.push(tag.name);
									});

									const handleEdit = () =>
										commitEdit({
											variables: {
												input: {
													assignmentId: assignment.id,
													data: {
														validAssignmentRolesRef:
															values.validAssignmentRolesRef!,
														startDate: values.startDate,
														endDate: values.endDate,
														personRef: values.personRef,
														importId: values.importId,
														isExecutive: values.isExecutive || false,
														comment: values.comment,
														weight: values.weight,
													},
													setTagsInput,
												},
											},
											onCompleted: () => {
												setSubmitting(false);
												onHide();
											},
										});

									const shouldCommitCuc =
										!!values.cuc || !!convertCUCToMarkerInputs(cucOpt);

									if (shouldCommitCuc) {
										commitSetCUC({
											variables: {
												input: {
													assignmentId: assignment.id,
													cuc: convertMarkerInputsToCUCInput(values.cuc),
												},
											},
											onCompleted: () => {
												handleEdit();
											},
										});
									} else {
										handleEdit();
									}
								}}
							/>
						</div>
					);
				}}
			/>
		</>
	);
};
