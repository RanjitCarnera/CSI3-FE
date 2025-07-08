import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query skillAssessmentTemplatesTable_Query($first: Int, $filterByName: String) {
		Viewer {
			Auth {
				currentAccount {
					id
				}
			}
		}

		...skillAssessmentTemplatesTable_AssessmentTemplatesFragment
			@arguments(first: $first, filterByName: $filterByName)
	}
`;

export const QUERY_FRAGMENT = graphql`
	fragment skillAssessmentTemplatesTable_AssessmentTemplatesFragment on Query
	@refetchable(queryName: "skillAssessmentTemplatesTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 250 }
		after: { type: "String" }
		before: { type: "String" }
		last: { type: "Int" }
		filterByName: { type: "String" }
		alwaysIncludeIds: { type: "[ID!]" }
		excludeIds: { type: "[ID!]" }
	) {
		Admin {
			Assessment {
				AssessmentTemplates(
					alwaysIncludeIds: $alwaysIncludeIds
					filterByName: $filterByName
					excludeIds: $excludeIds
					first: $first
					after: $after
					before: $before
					last: $last
				) @connection(key: "skillAssessmentTemplatesTable_AssessmentTemplates") {
					__id
					edges {
						node {
							id
							name
							...skillAssessmentTemplatesTable_AssessmentTemplateFragment
						}
					}
				}
			}
		}
	}
`;

export const ASSESSMENT_TEMPLATE_FRAGMENT = graphql`
	fragment skillAssessmentTemplatesTable_AssessmentTemplateFragment on AssessmentTemplate
	@inline {
		id
		name
		associatedRoles {
			name
			id
		}
		assessedSkills {
			name
			id
		}
		distributionList {
			emails
			role
		}
		...editTemplateButton_AssessmentTemplateFragment
	}
`;

export const DELETE_ASSESSMENT_TEMPLATE_MUTATION = graphql`
	mutation skillAssessmentTemplatesTable_DeleteAssessmentTemplateMutation(
		$input: DeleteAssessmentTemplateInput!
		$connections: [ID!]!
	) {
		Assessment {
			deleteAssessmentTemplate(input: $input) {
				clientMutationId
				deletedIds @deleteEdge(connections: $connections)
			}
		}
	}
`;
