import React, { useState } from "react";
import { useMutation } from "react-relay";
import { CREATE_PROJECT_MUTATION } from "./create-project-button.graphql";
import { type CreateProjectButtonProps } from "./create-project-button.interface";
import { type createProjectButton_CreateProjectMutation } from "../../../__generated__/createProjectButton_CreateProjectMutation.graphql";
import { EditProjectForm, type EditProjectFormState } from "../../ui/edit-project-form";
import { SuspenseDialogWithState } from "../../ui/SuspenseDialogWithState";
import { TkButton } from "../../ui/TkButton";

export const CreateProjectButton = ({ connectionId, className }: CreateProjectButtonProps) => {
	const [isVisible, setVisible] = useState<boolean>(false);
	const [create] =
		useMutation<createProjectButton_CreateProjectMutation>(CREATE_PROJECT_MUTATION);

	return (
		<div className={className}>
			<TkButton
				onClick={() => {
					setVisible(true);
				}}
				label={"Create new project"}
			/>

			<SuspenseDialogWithState<EditProjectFormState>
				title={"Create project"}
				isVisible={isVisible}
				onHide={() => {
					setVisible(false);
				}}
				affirmativeText={"Create"}
				formComponent={(ref, onHide) => {
					return (
						<EditProjectForm
							ref={ref}
							onSubmit={(values) => {
								create({
									variables: {
										input: {
											data: {
												name: values.name!,
												address: values.address,
												architectName: values.architectName,
												clientName: values.clientName,
												stageId: values.stageRef!,
												volume: values.volume,
												generalConditionsPercentage:
													values.generalConditionsPercentage,
												startDate: values.startDate || undefined,
												endDate: values.endDate || undefined,
												divisionId: values.divisionRef,
												regionId: values.regionRef,
												projectIdentifier: values.projectIdentifier,
												avatarId: values.avatarRef,
												skillsIds: values.skillsRef || [],
												comments: values.comments,
											},
											milestoneCreationData: {
												milestoneIds: [],
												creationData:
													values.milestones?.map((e) => ({
														name: e.name,
														date: e.name,
													})) ?? [],
											},
										},
										connectionId: connectionId || "",
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
		</div>
	);
};
