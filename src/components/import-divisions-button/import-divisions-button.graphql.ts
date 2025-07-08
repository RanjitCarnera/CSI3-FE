import { graphql } from "babel-plugin-relay/macro";

export const IMPORT_DIVISIONS_MUTATION = graphql`
	mutation importDivisionsButton_ImportDivisionsMutation($input: ImportDivisionsInput!) {
		Division {
			importDivisions(input: $input) {
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
