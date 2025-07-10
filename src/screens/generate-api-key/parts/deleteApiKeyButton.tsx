// import { useSelector } from "react-redux";
// import { useFragment, useMutation } from "react-relay";
// import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { useDialogLogic } from "@components/ui/useDialogLogic";
import { TkButtonLink } from "@components/ui/TkButtonLink";


type DeleteApiKeyButtonProps = {
	deleteApiKey: () => void;
};

export const DeleteApiKeyButton = ({ deleteApiKey }: DeleteApiKeyButtonProps) => {
	// const hasPermissions = useSelector(selectHasPermissions);
	// const hasPermission = hasPermissions(["UserInAccountPermission_Staff_Edit"]);

	const { dialogComponent, showDialog } = useDialogLogic();

	const setDeleteApiKey =()=> {
		deleteApiKey();
	}
	// return hasPermission ? (
	return (
		<>
			<TkButtonLink
				
				icon={"pi pi-trash"}
				iconPos="left"
				label={"Delete"}
				onClick={() => { 
					showDialog({
						title: `Delete API Key?`,
						content:
							"Do you really want to delete this Api Key? It will no longer be usable for authentication.",
						affirmativeText: "Delete",
						negativeText: "Cancel",
						dialogCallback: (result) => {
							if (result === "Accept") {
								setDeleteApiKey();
							}
						},
					});
				}}
			/>
			{dialogComponent}
		</>
	)
};
