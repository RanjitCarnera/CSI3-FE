import graphql from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query milestoneTemplatesTable_Query($name: String, $first: Int, $after: String) {
		...milestoneTemplatesTable_RefetchableQueryFragment
			@arguments(first: $first, after: $after, name: $name)
	}
`;

export const REFETCHABLE_QUERY_FRAGMENT = graphql`
	fragment milestoneTemplatesTable_RefetchableQueryFragment on Query
	@refetchable(queryName: "milestoneTemplatesTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 20 }
		after: { type: "String" }
		name: { type: "String" }
	) {
		MilestoneTemplate {
			MilestoneTemplate(name: $name, first: $first, after: $after)
				@connection(key: "milestoneTemplatesTable_MilestoneTemplate") {
				__id
				edges {
					node {
						...milestoneTemplatesTable_MilestoneTemplateInlineFragment
					}
				}
			}
		}
	}
`;

export const MILESTONE_TEMPLATE_INLINE_FRAGMENT = graphql`
	fragment milestoneTemplatesTable_MilestoneTemplateInlineFragment on MilestoneTemplate @inline {
		id
		data {
			name
			timeInPercent
		}
		...editMilestoneTemplateDataButton_MilestoneTemplateFragment
	}
`;

export const FETCH_QUERY = graphql`
	query milestoneTemplatesTable_FetchQuery {
		MilestoneTemplate {
			MilestoneTemplate(first: 100000) {
				edges {
					node {
						...milestoneTemplatesTable_MilestoneTemplateInlineFragment
					}
				}
			}
		}
	}
`;
