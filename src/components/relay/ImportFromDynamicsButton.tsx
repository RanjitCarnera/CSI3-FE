import { graphql } from "babel-plugin-relay/macro";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { DynamicsImportForm, type ImportFromDynamicsFormState } from "./DynamicsImportForm";
import { type ImportFromDynamicsButton_ImportFromDynamicsMutation } from "../../__generated__/ImportFromDynamicsButton_ImportFromDynamicsMutation.graphql";
import DynamicsIcon from "../../assets/dynamics-icon.png";
import { selectHasPermissions } from "../../redux/CurrentUserSlice";
import { SuspenseDialogWithState } from "../ui/SuspenseDialogWithState";
import { TkButton } from "../ui/TkButton";

const MUTATION = graphql`
	mutation ImportFromDynamicsButton_ImportFromDynamicsMutation(
		$input: ImportProjectFromDynamicsInput!
		$connectionIds: [ID!]!
	) {
		Dynamics {
			importProjectFromDynamics(input: $input) {
				edge @appendEdge(connections: $connectionIds) {
					node {
						...ProjectsTable_ProjectFragment
					}
				}
			}
		}
	}
`;

interface OwnProps {
	className?: string;
	connectionId: string;
}

export const ImportFromDynamicsButton = ({ connectionId, className }: OwnProps) => {
	const [isVisible, setVisible] = useState(false);
	const [doImport, isImporting] =
		useMutation<ImportFromDynamicsButton_ImportFromDynamicsMutation>(MUTATION);
	const hasPermissions = useSelector(selectHasPermissions);
	const hasPermission = hasPermissions([
		"UserInAccountPermission_Project_Edit",
		"AccountPermission_Auth_Field",
	]);

	return hasPermission ? (
		<>
			<TkButton
				className={className}
				icon={<img alt="dynamics" src={DynamicsIcon} height={16} width={16} />}
				iconPos="left"
				label="Import from Dynamics"
				disabled={isImporting}
				onClick={() => {
					setVisible(true);
				}}
			/>

			<SuspenseDialogWithState<ImportFromDynamicsFormState>
				title={"Import Project from Dynamics"}
				isVisible={isVisible}
				affirmativeText={"Import"}
				onHide={() => {
					setVisible(false);
				}}
				formComponent={(ref, onHide) => {
					return (
						<DynamicsImportForm
							ref={ref}
							onSubmit={(values, { setSubmitting }) => {
								doImport({
									variables: {
										input: {
											dynamicsProjectId: values.selectedProjectId!,
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
