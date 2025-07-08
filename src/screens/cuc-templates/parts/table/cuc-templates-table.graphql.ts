import graphql from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query cucTemplatesTable_Query($name: String, $first: Int, $after: String) {
		...cucTemplatesTable_RefetchableQueryFragment
			@arguments(first: $first, after: $after, name: $name)
	}
`;

export const REFETCHABLE_QUERY_FRAGMENT = graphql`
	fragment cucTemplatesTable_RefetchableQueryFragment on Query
	@refetchable(queryName: "cucTemplatesTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 20 }
		after: { type: "String" }
		name: { type: "String" }
	) {
		CucTemplate {
			CucTemplates(filterByName: $name, first: $first, after: $after)
				@connection(key: "cucTemplatesTable_CucTemplates") {
				__id
				edges {
					node {
						...cucTemplatesTable_CucTemplateInlineFragment
					}
				}
			}
		}
	}
`;

export const CUC_TEMPLATE_INLINE_FRAGMENT = graphql`
	fragment cucTemplatesTable_CucTemplateInlineFragment on CucTemplate @inline {
		id
		name
		cuc {
			...EditAssignmentButton_CUCInlineFragment
		}
		...editCucTemplateButton_CucTemplateFragment
	}
`;

export const FETCH_QUERY = graphql`
	query cucTemplatesTable_FetchQuery {
		CucTemplate {
			CucTemplates(first: 100000) {
				edges {
					node {
						...cucTemplatesTable_CucTemplateInlineFragment
					}
				}
			}
		}
	}
`;
