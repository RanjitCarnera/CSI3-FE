import { useMutation } from "react-relay";
import React from "react";
import { WithFeatureToggle } from "@components/with-feature-toggle/with-feature-toggle.component";
import { DeleteButton } from "@components/ui/DeleteButton";
import { type DeleteCucTemplatesButtonProps } from "./delete-cuc-templates-button.types";
import { DELETE_CUC_TEMPLATES_MUTATION } from "@screens/cuc-templates/parts/delete-cuc-templates-button/delete-cuc-templates-button.graphql";
import { type deleteCucTemplatesButton_DeleteCucTemplatesMutation } from "@relay/deleteCucTemplatesButton_DeleteCucTemplatesMutation.graphql";

export const DeleteCucTemplatesButton = ({
	ids,
	connectionId,
	onSuccess,
}: DeleteCucTemplatesButtonProps) => {
	const [commitDelete, isInFlight] =
		useMutation<deleteCucTemplatesButton_DeleteCucTemplatesMutation>(
			DELETE_CUC_TEMPLATES_MUTATION,
		);

	const handleHideOnClick = () => {
		onSuccess?.();
	};
	return (
		<WithFeatureToggle featureId={"CUC"}>
			<DeleteButton
				isDeleting={isInFlight}
				selectedIds={ids}
				singularName={"cuc template"}
				pluralName={"cuc templates"}
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
							handleHideOnClick();
						},
					});
				}}
			/>
		</WithFeatureToggle>
	);
};
