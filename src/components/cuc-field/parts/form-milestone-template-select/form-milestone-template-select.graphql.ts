import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query formMilestoneTemplateSelect_Query($filterByName: String) {
		MilestoneTemplate {
			MilestoneTemplate(first: 1000, name: $filterByName) {
				edges {
					node {
						...formMilestoneTemplateSelect_MilestoneTemplateInlineFragment
					}
				}
			}
		}
	}
`;

export const MILESTONE_TEMPLATE_INLINE_FRAGMENT = graphql`
	fragment formMilestoneTemplateSelect_MilestoneTemplateInlineFragment on MilestoneTemplate
	@inline {
		id
		data {
			name
		}
	}
`;
