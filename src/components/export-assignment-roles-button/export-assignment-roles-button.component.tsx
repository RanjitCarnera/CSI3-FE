import { useMutation } from "react-relay";
import { EXPORT_ASSIGNMENT_ROLES_MUTATION } from "@components/export-assignment-roles-button/export-assignment-roles-button.graphql";

import { ExportButton } from "@components/export-button";
import { type exportAssignmentRolesButton_ExportAssignmentRolesMutation } from "@relay/exportAssignmentRolesButton_ExportAssignmentRolesMutation.graphql";

export const ExportAssignmentRolesButton = () => {
	const [doExport, isExporting] =
		useMutation<exportAssignmentRolesButton_ExportAssignmentRolesMutation>(
			EXPORT_ASSIGNMENT_ROLES_MUTATION,
		);
	return (
		<ExportButton
			isExporting={isExporting}
			doExport={(success) => {
				doExport({
					variables: {},
					onCompleted: (response) => {
						success(response.Assignment.exportAssignmentRoles?.file?.url!);
					},
				});
			}}
		/>
	);
};
