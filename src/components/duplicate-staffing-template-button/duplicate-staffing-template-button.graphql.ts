import { graphql } from "babel-plugin-relay/macro";

export const STAFFING_TEMPLATE_FRAGMENT = graphql`
	fragment duplicateStaffingTemplateButton_StaffingTemplateFragment on StaffingTemplate {
		id
	}
`;

export const DUPLICATE_STAFFING_TEMPLATE = graphql`
	mutation duplicateStaffingTemplateButton_DuplicateStaffingTemplateMutation(
		$input: DuplicateStaffingTemplateInput!
		$connections: [ID!]!
	) {
		Template {
			duplicateStaffingTemplate(input: $input) {
				edge @appendEdge(connections: $connections) {
					node {
						id
						assignmentRoleAssociations {
							assignmentRole {
								name
							}
						}
						...EditStaffingTemplateButton_StaffingTemplateFragment
					}
				}
			}
		}
	}
`;
