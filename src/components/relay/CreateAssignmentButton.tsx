import { graphql } from "babel-plugin-relay/macro";
import React, { useMemo, useState } from "react";
import { useDrop } from "react-dnd";
import { useFragment, useMutation } from "react-relay";
import { type CUCFieldRef } from "@components/cuc-field/cuc-field.types";
import { convertMarkerInputsToCUCInput } from "@components/cuc-field/cuc-field.utils";
import type { PersonDragItem } from "@components/person-card/parts/person-card-draggable/person-card-draggable.types";
import { type DropProps } from "@components/relay/AssignmentCard";
import {
	type CreateAssignmentButton_CreateMutation,
	type SetTagsInputInput,
} from "../../__generated__/CreateAssignmentButton_CreateMutation.graphql";
import { type CreateAssignmentButton_ProjectFragment$key } from "../../__generated__/CreateAssignmentButton_ProjectFragment.graphql";
import { EditAssignmentForm, type EditAssignmentFormState } from "../ui/EditAssignmentForm";
import { SuspenseDialogWithState } from "../ui/SuspenseDialogWithState";
import { TkButtonLink } from "../ui/TkButtonLink";

const PROJECT_FRAGMENT = graphql`
	fragment CreateAssignmentButton_ProjectFragment on Project {
		id
		...EditAssignmentForm_ProjectFragment
	}
`;

const CREATE_MUTATION = graphql`
	mutation CreateAssignmentButton_CreateMutation(
		$input: CreateAssignmentInput!
		$connectionIds: [ID!]!
	) {
		Scenario {
			createAssignment(input: $input) {
				assignmentEdge @appendEdge(connections: $connectionIds) {
					node {
						...assignmentsInProject_AssignmentInlineFragment
					}
				}
				edge {
					node {
						...syncAssignmentsCucButton_ProjectInScenarioFragment
					}
				}
			}
		}
	}
`;

interface OwnProps {
	className?: string;
	scenarioId: string;
	projectFragmentRef: CreateAssignmentButton_ProjectFragment$key;
	assingmentsConnectionId: string;
}

export const CreateAssignmentButton = React.memo(
	({ className, scenarioId, projectFragmentRef, assingmentsConnectionId }: OwnProps) => {
		const [isVisible, setVisible] = useState<boolean>(false);
		const [assignmentRoleRef, setAssignmentRoleRef] = useState<string>("");
		const [personRef, setPersonRef] = useState<string>("");
		const project = useFragment<CreateAssignmentButton_ProjectFragment$key>(
			PROJECT_FRAGMENT,
			projectFragmentRef,
		);

		const [create] = useMutation<CreateAssignmentButton_CreateMutation>(CREATE_MUTATION);

		const [{ canDrop, isOver }, drop] = useDrop<PersonDragItem, {}, DropProps>(() => ({
			accept: "Person",
			collect: (monitor) => ({
				isOver: monitor.isOver(),
				canDrop: monitor.canDrop(),
			}),
			drop: (item) => {
				setPersonRef(item.id);
				setAssignmentRoleRef(item.assignmentRoleId ?? "");
				setVisible(true);
				return {};
			},
		}));

		const validDrag = useMemo(() => isOver && canDrop, [isOver, canDrop]);

		return (
			<div className={className}>
				<TkButtonLink
					ref={drop as any}
					onClick={() => {
						setVisible(true);
					}}
					style={
						validDrag
							? {
									color: "var(--success)",
									border: "1px solid var(--success)",
							  }
							: {}
					}
				>
					<div className="flex justify-content-center align-items-center">
						+ add new assignment
					</div>
				</TkButtonLink>

				<SuspenseDialogWithState<EditAssignmentFormState, CUCFieldRef>
					title={"Create assignment in project"}
					isVisible={isVisible}
					onHide={() => {
						setVisible(false);
						setPersonRef("");
						setAssignmentRoleRef("");
					}}
					affirmativeText={"Create"}
					formComponent={(ref, onHide) => {
						return (
							<EditAssignmentForm
								ref={ref}
								projectFragmentRef={project}
								initialState={{
									personRef: personRef || undefined,
									validAssignmentRolesRef: assignmentRoleRef
										? [assignmentRoleRef]
										: [],
									setTagsInput: [],
									cuc: undefined,
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
									create({
										variables: {
											input: {
												scenarioId,
												projectId: project.id,
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
												cuc: values.cuc
													? convertMarkerInputsToCUCInput(values.cuc)
													: undefined,
												setTagsInput,
											},
											connectionIds: [assingmentsConnectionId],
										},
										onCompleted: () => {
											setSubmitting(false);
											onHide();
											setPersonRef("");
											setAssignmentRoleRef("");
										},
									});
								}}
							/>
						);
					}}
				/>
			</div>
		);
	},
);
