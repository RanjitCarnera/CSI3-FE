import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { ImportButton } from "../ui/ImportButton";
import { ImportProjectStagesButton_ImportMutation } from "../../__generated__/ImportProjectStagesButton_ImportMutation.graphql";

const IMPORT_MUTATION = graphql`
	mutation ImportProjectStagesButton_ImportMutation($input: ImportProjectStagesInput!) {
		Project {
			importProjectStages(input: $input) {
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

export const ImportProjectStagesButton = ({ className }: OwnProps) => {
	const [doImport, isImporting] =
		useMutation<ImportProjectStagesButton_ImportMutation>(IMPORT_MUTATION);
	return (
		<ImportButton
			isImporting={isImporting}
			permission={"UserInAccountPermission_Project_Edit"}
			className={className}
			doImport={(fileId, onCompleted) => {
				doImport({
					variables: { input: { fileId: fileId } },
					onCompleted: (result) => {
						onCompleted(result.Project.importProjectStages?.result);
					},
				});
			}}
		/>
	);
};
