import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { ImportButton } from "../ui/ImportButton";
import { ImportSkillsButton_ImportMutation } from "../../__generated__/ImportSkillsButton_ImportMutation.graphql";

const IMPORT_MUTATION = graphql`
	mutation ImportSkillsButton_ImportMutation($input: ImportSkillsInput!) {
		Skills {
			importSkills(input: $input) {
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

export const ImportSkillsButton = ({ className }: OwnProps) => {
	const [doImport, isImporting] = useMutation<ImportSkillsButton_ImportMutation>(IMPORT_MUTATION);
	return (
		<ImportButton
			isImporting={isImporting}
			permission={"UserInAccountPermission_Skills_Edit"}
			className={className}
			doImport={(fileId, onCompleted) => {
				doImport({
					variables: { input: { fileId: fileId } },
					onCompleted: (result) => {
						onCompleted(result.Skills.importSkills?.result);
					},
				});
			}}
		/>
	);
};
