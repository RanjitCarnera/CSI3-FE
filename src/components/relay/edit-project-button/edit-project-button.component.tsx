import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import { EDIT_MUTATION, PROJECT_FRAGMENT } from "./edit-project-button.graphql";
import { type EditProjectButtonProps } from "./edit-project-button.interface";
import { type editProjectButton_EditMutation } from "../../../__generated__/editProjectButton_EditMutation.graphql";
import { type editProjectButton_ProjectFragment$key } from "../../../__generated__/editProjectButton_ProjectFragment.graphql";
import { selectHasPermissions } from "../../../redux/CurrentUserSlice";
import { EditProjectForm, type EditProjectFormState } from "../../ui/edit-project-form";
import { SuspenseDialogWithState } from "../../ui/SuspenseDialogWithState";
import { TkButtonLink } from "../../ui/TkButtonLink";
import { projectToState } from "../sync-project-from-dynamics-button/sync-project-from-dynamics-button.component";

export const EditProjectButton = ({
	className,
	hideLabel,
	projectFragmentRef,
}: EditProjectButtonProps) => {
	const hasPermissions = useSelector(selectHasPermissions);
	const hasPermission = hasPermissions(["UserInAccountPermission_Project_Edit"]);

	const [edit] = useMutation<editProjectButton_EditMutation>(EDIT_MUTATION);

	const [isVisible, setVisible] = useState(false);
	const project = useFragment<editProjectButton_ProjectFragment$key>(
		PROJECT_FRAGMENT,
		projectFragmentRef,
	);
	return hasPermission ? (
		<>
			<TkButtonLink
				className={className}
				icon="pi pi-pencil"
				iconPos="left"
				label={hideLabel ? "" : "Edit"}
				onClick={() => {
					setVisible(true);
				}}
			/>

			<SuspenseDialogWithState<EditProjectFormState>
				title={"Create project"}
				isVisible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
				formComponent={(ref, onHide) => {
					return (
						<EditProjectForm
							initialState={projectToState(project)}
							ref={ref}
							onSubmit={(values) => {
								edit({
									variables: {
										input: {
											projectId: project.id,
											data: {
												name: values.name!,
												address: values.address,
												architectName: values.architectName,
												clientName: values.clientName,
												stageId: values.stageRef!,
												volume: values.volume,
												generalConditionsPercentage:
													values.generalConditionsPercentage,
												startDate: values.startDate!,
												endDate: values.endDate!,
												divisionId: values.divisionRef,
												regionId: values.regionRef,
												projectIdentifier: values.projectIdentifier,
												avatarId: values.avatarRef,
												skillsIds: values.skillsRef || [],
												comments: values.comments,
												budgetedLaborCosts: values.budgetedLaborCosts,
											},
											milestoneCreationData: {
												creationData:
													values.milestones?.map((e) => ({
														projectId: project.id,
														milestoneData: {
															date: e.date,
															name: e.name,
														},
														milestoneIdOpt: e.id ? e.id : null,
													})) ?? [],
												milestoneIds: [],
											},
											moveAssignmentStartDates:
												values.moveAssigmentStartDates || false,
											moveAssignmentEndDates:
												values.moveAssigmentEndDates || false,
										},
									},
									onCompleted: () => {
										ref.current?.setSubmitting(false);
										onHide();
									},
									onError: () => {
										ref.current?.setSubmitting(false);
									},
								});
							}}
						/>
					);
				}}
			/>
		</>
	) : null;
};
