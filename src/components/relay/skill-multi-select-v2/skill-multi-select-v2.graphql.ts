import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query skillMultiSelectV2_Query($filterByName: String, $alwaysIncludeIds: [ID!]) {
		Skills {
			Skills(first: 250, filterByName: $filterByName, alwaysIncludeIds: $alwaysIncludeIds) {
				edges {
					node {
						...skillMultiSelectV2_SkillFragment
					}
				}
			}
		}
	}
`;
export const SKILL_FRAGMENT = graphql`
	fragment skillMultiSelectV2_SkillFragment on Skill @inline {
		name
		id
		skillCategory {
			id
			name
		}
	}
`;
