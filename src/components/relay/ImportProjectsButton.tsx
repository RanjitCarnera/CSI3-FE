import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { ImportButton } from "../ui/ImportButton";
import { ImportProjectsButton_ImportMutation } from "../../__generated__/ImportProjectsButton_ImportMutation.graphql";

const IMPORT_MUTATION = graphql`
	mutation ImportProjectsButton_ImportMutation($input: ImportProjectsInput!) {
		Project {
			importProjects(input: $input) {
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

export const ImportProjectsButton = ({ className }: OwnProps) => {
	const [doImport, isImporting] =
		useMutation<ImportProjectsButton_ImportMutation>(IMPORT_MUTATION);
	return (
		<ImportButton
			isImporting={isImporting}
			permission={"UserInAccountPermission_Project_Edit"}
			className={className}
			doImport={(fileId, onCompleted) => {
				doImport({
					variables: { input: { fileId: fileId } },
					onCompleted: (result) => {
						onCompleted(result.Project.importProjects?.result);
					},
				});
			}}
		/>
	);
};
