import React from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { toast } from "react-toastify";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type importPeoplesoftButton_DownloadPeopleDataFromS3Mutation } from "@relay/importPeoplesoftButton_DownloadPeopleDataFromS3Mutation.graphql";
import { APP_NAME } from "@utils/consts";
import { IMPORT_PEOPLESOFT_BUTTON_MUTATION } from "./import-peoplesoft-button.graphql";
import { type ImportPeoplesoftButtonProps } from "./import-peoplesoft-button.interface";
import { TkButton } from "../../ui/TkButton";

export const ImportPeoplesoftButton = ({ className, peopleIds }: ImportPeoplesoftButtonProps) => {
	const [sync, isImporting] =
		useMutation<importPeoplesoftButton_DownloadPeopleDataFromS3Mutation>(
			IMPORT_PEOPLESOFT_BUTTON_MUTATION,
		);

	const hasPermissions = useSelector(selectHasPermissions);
	const hasPermission = hasPermissions([
		"UserInAccountPermission_Staff_Edit",
		"AccountPermission_Auth_Field",
	]);

	if (!hasPermission) return null;
	return (
		<TkButton
			className={className}
			tooltip="Update all users from PeopleSoft"
			label={
				isImporting
					? "Updating..."
					: peopleIds?.length === 0 || !peopleIds
					? "Update all from Peoplesoft"
					: `Update ${peopleIds.length} from Peoplesoft`
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
							`Found ${e.Peoplesoft.downloadPeopleDataFromS3?.imported} users in file, found and updated ${e.Peoplesoft.downloadPeopleDataFromS3?.edited} in ${APP_NAME}.`,
						);
						window.location.reload();
					},
				})
			}
		/>
	);
};
