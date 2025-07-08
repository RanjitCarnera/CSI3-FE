import {graphql} from "babel-plugin-relay/macro";

export const IMPORT_SKILL_CATEGORIES_MUTATION = graphql`
    mutation importSkillCategoriesButton_ImportSkillCategoriesMutation($input: ImportSkillCategoriesInput!) {
        Skills {
            importSkillCategories(input: $input) {
                result {
                    editedEntities
                    newEntities
                    issues {
                        row
                        issue
                    }
                }
            }
        }
    }
`;
