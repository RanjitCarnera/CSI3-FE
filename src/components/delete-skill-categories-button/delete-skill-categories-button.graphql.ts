import { graphql } from "babel-plugin-relay/macro";

export const DELETE_SKILL_CATEGORY_MUTATION = graphql`
	mutation deleteSkillCategoriesButton_DeleteSkillCategoryMutation(
		$input: DeleteSkillCategoryInput!
		$connections: [ID!]!
	) {
		Skills {
			deleteSkillCategory(input: $input) {
				deletedIds @deleteEdge(connections: $connections)
			}
		}
	}
`;
