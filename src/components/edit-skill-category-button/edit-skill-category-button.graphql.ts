import { graphql } from "babel-plugin-relay/macro";

export const EDIT_SKILL_CATEGORY_MUTATION = graphql`
	mutation editSkillCategoryButton_EditSkillCategoryMutation($input: EditSkillCategoryInput!) {
		Skills {
			editSkillCategory(input: $input) {
				edge {
					node {
						id
						...editSkillCategoryButton_SkillCategoryFragment
					}
				}
			}
		}
	}
`;

export const SKILL_CATEGORY_FRAGMENT = graphql`
	fragment editSkillCategoryButton_SkillCategoryFragment on SkillCategory {
		id
		name
	}
`;
