import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query formCucTemplateSelect_Query(
		$first: Int
		$after: String
		$filterByName: String
		$alwaysIncludeId: [ID!]
	) {
		CucTemplate {
			CucTemplates(
				first: $first
				after: $after
				filterByName: $filterByName
				alwaysIncludeIds: $alwaysIncludeId
			) @connection(key: "formCucTemplateSelect_CucTemplates") {
				edges {
					node {
						...formCucTemplateSelect_CucTemplateInlineFragment
					}
				}
			}
		}
	}
`;

export const CUC_TEMPLATE_INLINE_FRAGMENT = graphql`
	fragment formCucTemplateSelect_CucTemplateInlineFragment on CucTemplate @inline {
		id
		name
		cuc {
			...EditAssignmentButton_CUCInlineFragment
			markers {
				percentageOfWeighting
				... on SimpleMarker {
					percentageInTime
				}
				... on CustomMarker {
					percentageInTime
					name
				}
				... on MilestoneMarker {
					percentageInTime
					milestone {
						id
						data {
							name
							date
						}
					}
				}
				... on MilestoneTemplateMarker {
					milestoneTemplate {
						data {
							timeInPercent
							name
						}
						id
					}
				}
			}
		}
	}
`;
