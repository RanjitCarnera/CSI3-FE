import { useMutation } from "react-relay";
import { IMPORT_ASSIGNMENT_ROLES_MUTATION } from "@components/import-assignment-roles-button/import-assignment-roles-button.graphql";
import { type importAssignmentRolesButton_ImportAssignmentRolesMutation } from "@relay/importAssignmentRolesButton_ImportAssignmentRolesMutation.graphql";
import { ImportButton } from "../ui/ImportButton";

export const ImportAssignmentRolesButton = () => {
	const [doImport, isImporting] =
		useMutation<importAssignmentRolesButton_ImportAssignmentRolesMutation>(
			IMPORT_ASSIGNMENT_ROLES_MUTATION,
		);
	return (
		<ImportButton
			isImporting={isImporting}
			permission={"UserInAccountPermission_AssignmentRole_Edit"}
			doImport={(fileId, onCompleted) => {
				doImport({
					variables: { input: { fileId } },
					onCompleted: (result) => {
						onCompleted(result.Assignment.importAssignmentRoles?.result);
					},
				});
			}}
		/>
	);
};
