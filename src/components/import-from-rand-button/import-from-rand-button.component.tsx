import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { FromRandIcon } from "@components/from-rand-icon";
import { IMPORT_FROM_RAND_MUTATION } from "@components/import-from-rand-button/import-from-rand-button.graphql";
import { type ImportFromRandButtonProps } from "@components/import-from-rand-button/import-from-rand-button.types";
import { RandImportForm } from "@components/rand-import-form/rand-import-form.component";
import { type ImportFromRandFormState } from "@components/rand-import-form/rand-import-form.types";
import { selectCurrentAccountId } from "@redux/AuthSlice";
import { type importFromRandButton_ImportFromRandMutation } from "@relay/importFromRandButton_ImportFromRandMutation.graphql";

import { selectHasPermissions } from "../../redux/CurrentUserSlice";
import { SuspenseDialogWithState } from "../ui/SuspenseDialogWithState";
import { TkButton } from "../ui/TkButton";

export const ImportFromRandButton = ({ connectionId, className }: ImportFromRandButtonProps) => {
	const [isVisible, setVisible] = useState(false);
	const [doImport, isImporting] =
		useMutation<importFromRandButton_ImportFromRandMutation>(IMPORT_FROM_RAND_MUTATION);
	const hasPermissions = useSelector(selectHasPermissions);
	const hasPermission = hasPermissions([
		"UserInAccountPermission_Project_Edit",
		"AccountPermission_Rand_DataWarehouseIntegration",
	]);

	const currentAccountId = useSelector(selectCurrentAccountId);
	const isAccount = [
		"Account:0377a1e0-45b6-46bf-a245-3457b0ece116",
		"Account:9c40380a-8875-4ce8-8360-bf0c24860378",
	].includes(currentAccountId ?? "");
	return hasPermission && isAccount ? (
		<>
			<TkButton
				className={className}
				icon={<FromRandIcon />}
				iconPos="left"
				label="Import from rand"
				disabled={isImporting}
				onClick={() => {
					setVisible(true);
				}}
			/>

			<SuspenseDialogWithState<ImportFromRandFormState>
				title={"Import Project from rand"}
				isVisible={isVisible}
				affirmativeText={"Import"}
				onHide={() => {
					setVisible(false);
				}}
				formComponent={(ref, onHide) => {
					return (
						<RandImportForm
							ref={ref}
							onSubmit={(values, { setSubmitting }) => {
								doImport({
									variables: {
										input: {
											jobNumber: values.selectedProjectId!,
										},
										connectionIds: [connectionId],
									},
									onCompleted: () => {
										setSubmitting(false);
										onHide();
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
