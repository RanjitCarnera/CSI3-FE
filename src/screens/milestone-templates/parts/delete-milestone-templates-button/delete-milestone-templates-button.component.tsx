import { Button, Dialog } from "@thekeytechnology/framework-react-components";
import React, { Fragment, useState } from "react";
import { readInlineData, useMutation } from "react-relay";
import { toast } from "react-toastify";
import { DeleteButton } from "@components/ui/DeleteButton";
import { TkMessage } from "@components/ui/TkMessage";
import { WithFeatureToggle } from "@components/with-feature-toggle/with-feature-toggle.component";
import {
	type deleteMilestoneTemplatesButton_DeleteMilestoneTemplateResponseInterfaceInlineFragment$data,
	type deleteMilestoneTemplatesButton_DeleteMilestoneTemplateResponseInterfaceInlineFragment$key,
} from "@relay/deleteMilestoneTemplatesButton_DeleteMilestoneTemplateResponseInterfaceInlineFragment.graphql";
import { type deleteMilestoneTemplatesButton_DeleteMilestoneTemplatesMutation } from "@relay/deleteMilestoneTemplatesButton_DeleteMilestoneTemplatesMutation.graphql";
import {
	DELETE_MILESTONE_TEMPLATE_RESPONSE_INTERFACE_INLINE_FRAGMENT,
	DELETE_MILESTONE_TEMPLATES_MUTATION,
} from "@screens/milestone-templates/parts/delete-milestone-templates-button/delete-milestone-templates-button.graphql";
import { type DeleteMilestoneTemplatesButtonProps } from "@screens/milestone-templates/parts/delete-milestone-templates-button/delete-milestone-templates-button.types";

export const DeleteMilestoneTemplatesButton = ({
	ids,
	connectionId,
	onSuccess,
}: DeleteMilestoneTemplatesButtonProps) => {
	const [commitDelete, isInFlight] =
		useMutation<deleteMilestoneTemplatesButton_DeleteMilestoneTemplatesMutation>(
			DELETE_MILESTONE_TEMPLATES_MUTATION,
		);

	const [response, setResponse] =
		useState<deleteMilestoneTemplatesButton_DeleteMilestoneTemplateResponseInterfaceInlineFragment$data | null>(
			null,
		);

	const handleHideOnClick = () => {
		setResponse(null);
		onSuccess?.();
	};
	return (
		<WithFeatureToggle featureId={"CUC"}>
			{response ? (
				<Dialog title={"Deletion report"} onHide={handleHideOnClick} visible>
					<h4>
						{response.kind === "BadDeleteMilestoneTemplateResponse"
							? "Some milestone templates could not be deleted."
							: ""}
					</h4>
					<TkMessage
						className="mb-3 w-12"
						content={
							<div>
								<div>
									<strong>{response.deletedIds.length}</strong> were deleted.
								</div>

								<div>
									<h4>Deletion issues</h4>
									<p>
										Milestone templates that are currently being referenced on
										an assignment roles cannot be deleted unless they are
										removed from the assignment roles first.
									</p>
									{response.issues?.map((issue) =>
										issue.assignmentRoles.length ? (
											<div>
												<strong>
													Milestone Template '
													{issue.milestoneTemplate?.data.name}'{" "}
												</strong>
												is referenced by:{" "}
												{issue.assignmentRoles.map((e) => (
													<strong key={e.name}>{e.name}</strong>
												))}
											</div>
										) : (
											<Fragment />
										),
									)}
								</div>
							</div>
						}
					/>
					<Button content={{ label: "Close" }} onClick={handleHideOnClick} />
				</Dialog>
			) : (
				<DeleteButton
					isDeleting={isInFlight}
					selectedIds={ids}
					singularName={"milestone template"}
					pluralName={"milestone templates"}
					doDelete={(ids) => {
						commitDelete({
							variables: {
								input: {
									ids,
								},
								connections: connectionId ? [connectionId] : [],
							},
							onCompleted: (response) => {
								onSuccess?.();
								if (!response.MilestoneTemplate.deleteMilestoneTemplates?.response)
									return;
								const readResponse =
									readInlineData<deleteMilestoneTemplatesButton_DeleteMilestoneTemplateResponseInterfaceInlineFragment$key>(
										DELETE_MILESTONE_TEMPLATE_RESPONSE_INTERFACE_INLINE_FRAGMENT,
										response.MilestoneTemplate.deleteMilestoneTemplates
											.response,
									);
								if (readResponse.kind === "BadDeleteMilestoneTemplateResponse") {
									setResponse(readResponse);
								} else {
									toast.success("Deleted successfully.");
								}
							},
						});
					}}
				/>
			)}
		</WithFeatureToggle>
	);
};
