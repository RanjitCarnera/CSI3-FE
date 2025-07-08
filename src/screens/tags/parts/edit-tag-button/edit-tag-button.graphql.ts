import { graphql } from "babel-plugin-relay/macro";

export const TAG_FRAGMENT = graphql`
	fragment editTagButton_TagFragment on Tag {
		id
		data {
			name
			color
			sortOrder
		}
	}
`;
export const EDIT_TAG_DATA_MUTATION = graphql`
	mutation editTagButton_editTagDataMutation($input: EditPartialTagDataInput!) {
		Tag {
			editPartialTagData(input: $input) {
				cleanedTags {
					node {
						...editTagButton_TagFragment
					}
				}
			}
		}
	}
`;
