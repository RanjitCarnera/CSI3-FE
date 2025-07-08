import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { type ImportStaffingTemplatesButton_ImportMutation } from "../../__generated__/ImportStaffingTemplatesButton_ImportMutation.graphql";
import { ImportButton } from "../ui/ImportButton";

const IMPORT_MUTATION = graphql`
	mutation ImportStaffingTemplatesButton_ImportMutation($input: ImportStaffingTemplatesInput!) {
		Template {
			importStaffingTemplates(input: $input) {
				result {
					editedEntities
					newEntities
					issues {
						row
						issue
					}
				}
			}
		}
	}
`;

export const ImportStaffingTemplatesButton = () => {
	const [doImport, isImporting] =
		useMutation<ImportStaffingTemplatesButton_ImportMutation>(IMPORT_MUTATION);
	return (
		<ImportButton
			isImporting={isImporting}
			permission={"UserInAccountPermission_Templates_Edit"}
			doImport={(fileId, onCompleted) => {
				doImport({
					variables: { input: { fileId } },
					onCompleted: (result) => {
						onCompleted(result.Template.importStaffingTemplates?.result);
					},
				});
			}}
		/>
	);
};
