import { graphql } from "babel-plugin-relay/macro";

export const DELETE_MILESTONE_TEMPLATES_MUTATION = graphql`
	mutation deleteMilestoneTemplatesButton_DeleteMilestoneTemplatesMutation(
		$input: DeleteMilestoneTemplatesInput!
		$connections: [ID!]!
	) {
		MilestoneTemplate {
			deleteMilestoneTemplates(input: $input) {
				response {
					deletedIds @deleteEdge(connections: $connections)
					...deleteMilestoneTemplatesButton_DeleteMilestoneTemplateResponseInterfaceInlineFragment
				}
			}
		}
	}
`;

export const DELETE_MILESTONE_TEMPLATE_RESPONSE_INTERFACE_INLINE_FRAGMENT = graphql`
	fragment deleteMilestoneTemplatesButton_DeleteMilestoneTemplateResponseInterfaceInlineFragment on DeleteMilestoneTemplateResponseInterface
	@inline {
		kind
		deletedIds @deleteEdge(connections: $connections)
		... on BadDeleteMilestoneTemplateResponseType {
			issues {
				assignmentRoles {
					name
				}
				milestoneTemplate {
					data {
						name
					}
				}
			}
		}
	}
`;
