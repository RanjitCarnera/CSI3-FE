import { graphql } from "babel-plugin-relay/macro";

export const IMPORT_TAGS_MUTATION = graphql`
	mutation importTagsButton_importTagsMutation($input: ImportTagsInput!) {
		Tag {
			importTags(input: $input) {
				result {
					issues {
						issue
						row
					}
					editedEntities
					newEntities
				}
			}
		}
	}
`;
