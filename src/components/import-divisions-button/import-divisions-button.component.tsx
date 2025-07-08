import { useMutation } from "react-relay";
import { IMPORT_DIVISIONS_MUTATION } from "@components/import-divisions-button/import-divisions-button.graphql";
import { type importDivisionsButton_ImportDivisionsMutation } from "@relay/importDivisionsButton_ImportDivisionsMutation.graphql";
import { ImportButton } from "../ui/ImportButton";

export const ImportDivisionsButton = () => {
	const [doImport, isImporting] =
		useMutation<importDivisionsButton_ImportDivisionsMutation>(IMPORT_DIVISIONS_MUTATION);
	return (
		<ImportButton
			isImporting={isImporting}
			permission={"UserInAccountPermission_Division_Edit"}
			doImport={(fileId, onCompleted) => {
				doImport({
					variables: { input: { fileId } },
					onCompleted: (result) => {
						onCompleted(result.Division.importDivisions?.result);
					},
				});
			}}
		/>
	);
};
