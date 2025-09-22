import { graphql } from "babel-plugin-relay/macro";

export const IMPORT_SOUTHWAY_BUTTON_MUTATION = graphql`
	mutation importSouthwayButton_importPeopleFromSouthwayDWHMutation(
		$input: ImportPeopleFromSouthwayDWHInput!
	) {
		Southway {
			importPeopleFromSouthwayDWH(input: $input) {
				edited
				imported
				clientMutationId
			}
		}
	}
`;
