import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { type ImportRegionsButton_ImportMutation } from "../../__generated__/ImportRegionsButton_ImportMutation.graphql";
import { ImportButton } from "../ui/ImportButton";

const IMPORT_MUTATION = graphql`
	mutation ImportRegionsButton_ImportMutation($input: ImportRegionsInput!) {
		Region {
			importRegions(input: $input) {
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

export const ImportRegionsButton = () => {
	const [doImport, isImporting] =
		useMutation<ImportRegionsButton_ImportMutation>(IMPORT_MUTATION);
	return (
		<ImportButton
			isImporting={isImporting}
			permission={"UserInAccountPermission_Region_Edit"}
			doImport={(fileId, onCompleted) => {
				doImport({
					variables: { input: { fileId } },
					onCompleted: (result) => {
						onCompleted(result.Region.importRegions?.result);
					},
				});
			}}
		/>
	);
};
