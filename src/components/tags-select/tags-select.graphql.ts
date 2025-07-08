import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query tagsSelect_Query($name: String) {
		Tag {
			GetTagsByName(name: $name, first: 20) @connection(key: "tagsSelect_GetTagsByName") {
				edges {
					node {
						...tagsSelect_TagInlineFragment
					}
				}
			}
		}
	}
`;

export const TAG_INLINE_FRAGMENT = graphql`
	fragment tagsSelect_TagInlineFragment on Tag @inline {
		id
		data {
			name
			color
		}
	}
`;
