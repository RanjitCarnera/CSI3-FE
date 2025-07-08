import { graphql } from "babel-plugin-relay/macro";

export const CREATE_SKILL_CATEGORY_MUTATION = graphql`
	mutation createSkillCategoryButton_CreateSkillCategoryMutation(
		$input: CreateSkillCategoryInput!
		$connections: [ID!]!
	) {
		Skills {
			createSkillCategory(input: $input) {
				edge @appendEdge(connections: $connections) {
					node {
						id
						...editSkillCategoryButton_SkillCategoryFragment
					}
				}
			}
		}
	}
`;
