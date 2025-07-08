import { graphql } from "babel-plugin-relay/macro";

export const DELETE_TAG_MUTATION = graphql`
	mutation deleteTagButton_deleteTagMutation($input: SoftDeleteTagsInput!, $connections: [ID!]!) {
		Tag {
			softDeleteTags(input: $input) {
				deletedIds @deleteEdge(connections: $connections)
				cleanedTags {
					node {
						...tagsTable_TagInlineFragment
					}
				}
			}
		}
	}
`;
