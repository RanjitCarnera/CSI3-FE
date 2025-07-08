import graphql from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query skillCategoriesTable_Query($first: Int, $filterByName: String) {
		...skillCategoriesTable_QueryFragment @arguments(first: $first, filterByName: $filterByName)
	}
`;

export const QUERY_FRAGMENT = graphql`
	fragment skillCategoriesTable_QueryFragment on Query
	@refetchable(queryName: "skillCategoriesTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 20 }
		after: { type: "String" }
		filterByName: { type: "String" }
	) {
		Skills {
			SkillCategories(first: $first, after: $after, filterByName: $filterByName)
				@connection(key: "skillCategoriesTable_SkillCategories") {
				__id
				pageInfo {
					endCursor
					hasPreviousPage
					hasNextPage
					startCursor
				}
				edges {
					node {
						id
						name
						sortOrder
						...editSkillCategoryButton_SkillCategoryFragment

						...SkillCategorySortOrderButtons_AssignmentRoleFragment
					}
				}
			}
		}
	}
`;
