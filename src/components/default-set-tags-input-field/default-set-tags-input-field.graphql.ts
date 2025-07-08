import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query defaultSetTagsInputField_Query($name: String) {
		Tag {
			GetTagsByName(name: $name, first: 50) {
				edges {
					node {
						...defaultSetTagsInputField_TagInlineFragment
					}
				}
			}
		}
	}
`;

export const TAG_INLINE_FRAGMENT = graphql`
	fragment defaultSetTagsInputField_TagInlineFragment on Tag @inline {
		id
		data {
			name
			color
		}
	}
`;
