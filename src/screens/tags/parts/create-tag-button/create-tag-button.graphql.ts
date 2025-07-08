import { graphql } from "babel-plugin-relay/macro";

export const CREATE_TAG_FROM_NAME_MUTATION = graphql`
	mutation createTagButton_createTagFromNameMutation(
		$input: CreateTagFromNameInput!
		$connections: [ID!]!
	) {
		Tag {
			createTagFromName(input: $input) {
				createdTag @appendEdge(connections: $connections) {
					node {
						...tagsTable_TagInlineFragment
					}
				}
				cleanedTags {
					node {
						...tagsTable_TagInlineFragment
					}
				}
			}
		}
	}
`;
