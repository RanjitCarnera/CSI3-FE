import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query skillMultiSelect_Query($filterByName: String, $alwaysIncludeIds: [ID!]) {
		Skills {
			Skills(first: 250, filterByName: $filterByName, alwaysIncludeIds: $alwaysIncludeIds) {
				edges {
					node {
						...skillMultiSelect_SkillFragment
					}
				}
			}
		}
	}
`;
export const SKILL_FRAGMENT = graphql`
	fragment skillMultiSelect_SkillFragment on Skill @inline {
		name
		id
	}
`;
