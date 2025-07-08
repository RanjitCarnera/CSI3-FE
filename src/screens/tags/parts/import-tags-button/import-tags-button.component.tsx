import { useMutation } from "react-relay";
import { ImportButton } from "@components/ui/ImportButton";
import { type importTagsButton_importTagsMutation } from "@relay/importTagsButton_importTagsMutation.graphql";
import { IMPORT_TAGS_MUTATION } from "@screens/tags/parts/import-tags-button/import-tags-button.graphql";

export const ImportTagsButton = () => {
	const [doImport, isImporting] =
		useMutation<importTagsButton_importTagsMutation>(IMPORT_TAGS_MUTATION);
	return (
		<ImportButton
			isImporting={isImporting}
			permission={"UserInAccountPermission_Tag_AdminEdit"}
			doImport={(fileId, onCompleted) => {
				doImport({
					variables: { input: { fileId } },
					onCompleted: (result) => {
						onCompleted(result.Tag.importTags?.result);
					},
				});
			}}
		/>
	);
};
