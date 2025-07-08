import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { ImportButton } from "../ui/ImportButton";
import { ImportPeopleButton_ImportMutation } from "../../__generated__/ImportPeopleButton_ImportMutation.graphql";

const IMPORT_MUTATION = graphql`
	mutation ImportPeopleButton_ImportMutation($input: ImportPeopleInput!) {
		Staff {
			importPeople(input: $input) {
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

export const ImportPeopleButton = ({ className }: OwnProps) => {
	const [doImport, isImporting] = useMutation<ImportPeopleButton_ImportMutation>(IMPORT_MUTATION);
	return (
		<ImportButton
			isImporting={isImporting}
			permission={"UserInAccountPermission_Staff_Edit"}
			className={className}
			doImport={(fileId, onCompleted) => {
				doImport({
					variables: { input: { fileId: fileId } },
					onCompleted: (result) => {
						onCompleted(result.Staff.importPeople?.result);
					},
				});
			}}
		/>
	);
};
