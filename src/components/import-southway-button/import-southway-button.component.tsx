import React from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { toast } from "react-toastify";
import { TkButton } from "@components/ui/TkButton";
import { selectHasPermissions, selectHasStrictPermissions } from "@redux/CurrentUserSlice";
import { type importSouthwayButton_importPeopleFromSouthwayDWHMutation } from "@relay/importSouthwayButton_importPeopleFromSouthwayDWHMutation.graphql";

import { APP_NAME } from "@utils/consts";
import { IMPORT_SOUTHWAY_BUTTON_MUTATION } from "./import-southway-button.graphql";
import { type ImportSouthwayButtonProps } from "./import-southway-button.interface";

export const ImportSouthwayButton = ({ className, peopleIds }: ImportSouthwayButtonProps) => {
	const [sync, isImporting] =
		useMutation<importSouthwayButton_importPeopleFromSouthwayDWHMutation>(
			IMPORT_SOUTHWAY_BUTTON_MUTATION,
		);

	const checkHasPermission = useSelector(selectHasPermissions);
	const hasStaffEditPermissions = checkHasPermission(["UserInAccountPermission_Staff_Edit"]);
	const checkHasStrictPermission = useSelector(selectHasStrictPermissions);
	const hasAccountGroupPermissions = checkHasStrictPermission([
		"AccountPermission_Southway_READDWH",
	]);

	const hasPermission = hasStaffEditPermissions && hasAccountGroupPermissions;
	if (!hasPermission) return null;
	return (
		<TkButton
			className={className}
			tooltip="Update all users from Southway DWH"
			label={
				isImporting
					? "Updating..."
					: peopleIds?.length === 0 || !peopleIds
					? "Update all from Southway DWH"
					: `Update ${peopleIds.length} from Southway DWH`
			}
			disabled={isImporting}
			onClick={() =>
				sync({
					variables: {
						input: {
							limitToPeople: peopleIds,
						},
					},
					onCompleted: (e) => {
						toast.success(
							`Found ${e.Southway.importPeopleFromSouthwayDWH?.imported} users in file, found and updated ${e.Southway.importPeopleFromSouthwayDWH?.edited} in ${APP_NAME}.`,
						);
						window.location.reload();
					},
				})
			}
		/>
	);
};
