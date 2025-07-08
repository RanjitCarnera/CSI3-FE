import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { type ImportScenariosButton_ImportMutation } from "../../__generated__/ImportScenariosButton_ImportMutation.graphql";
import { ImportButton } from "../ui/ImportButton";

const IMPORT_MUTATION = graphql`
	mutation ImportScenariosButton_ImportMutation($input: ImportScenariosInput!) {
		Scenario {
			importScenarios(input: $input) {
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

export const ImportScenariosButton = () => {
	const [doImport, isImporting] =
		useMutation<ImportScenariosButton_ImportMutation>(IMPORT_MUTATION);
	return (
		<ImportButton
			isImporting={isImporting}
			permission={"UserInAccountPermission_Scenario_Edit"}
			doImport={(fileId, onCompleted) => {
				doImport({
					variables: { input: { fileId } },
					onCompleted: (result) => {
						onCompleted(result.Scenario.importScenarios?.result);
					},
				});
			}}
		/>
	);
};
