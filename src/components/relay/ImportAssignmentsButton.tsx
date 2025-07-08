import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { ImportButton } from "../ui/ImportButton";
import { ImportAssignmentsButton_ImportMutation } from "../../__generated__/ImportAssignmentsButton_ImportMutation.graphql";

const IMPORT_MUTATION = graphql`
	mutation ImportAssignmentsButton_ImportMutation($input: ImportAssignmentsInput!) {
		Scenario {
			importAssignments(input: $input) {
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

interface OwnProps {
	className?: string;
}

export const ImportAssignmentsButton = ({ className }: OwnProps) => {
	const [doImport, isImporting] =
		useMutation<ImportAssignmentsButton_ImportMutation>(IMPORT_MUTATION);
	return (
		<ImportButton
			isImporting={isImporting}
			permission={"UserInAccountPermission_Scenario_Edit"}
			className={className}
			doImport={(fileId, onCompleted) => {
				doImport({
					variables: { input: { fileId: fileId } },
					onCompleted: (result) => {
						onCompleted(result.Scenario.importAssignments?.result);
					},
				});
			}}
		/>
	);
};
