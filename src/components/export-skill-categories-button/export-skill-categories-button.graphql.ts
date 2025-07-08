import {graphql} from "babel-plugin-relay/macro";

export const EXPORT_SKILL_CATEGORIES_MUTATION = graphql`
    mutation exportSkillCategoriesButton_ExportSkillCategoriesMutation {
        Skills {
            exportSkillCategories(input: {}) {
                file {
                    url
                }
            }
        }
    }
`
