import graphql from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query tagsTable_Query($name: String) {
		...tagsTable_QueryFragment @arguments(name: $name)
	}
`;

export const QUERY_FRAGMENT = graphql`
	fragment tagsTable_QueryFragment on Query
	@refetchable(queryName: "tagsTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 20 }
		after: { type: "String" }
		name: { type: "String" }
	) {
		Tag {
			GetTagsByName(name: $name, first: $first, after: $after)
				@connection(key: "tagsTable_GetTagsByName") {
				__id
				edges {
					node {
						...tagsTable_TagInlineFragment
					}
				}
			}
		}
	}
`;

export const SET_TAGS_SORT_ORDER_MUTATION = graphql`
	mutation tagsTable_SetTagsSortOrderMutation($input: SetTagSortOrderInput!) {
		Tag {
			setTagSortOrder(input: $input) {
				changedTags {
					...tagsTable_TagInlineFragment
				}
			}
		}
	}
`;

export const TAG_INLINE_FRAGMENT = graphql`
	fragment tagsTable_TagInlineFragment on Tag @inline {
		id
		data {
			name
			sortOrder
			color
		}
		...editTagButton_TagFragment
	}
`;
