import { graphql } from "babel-plugin-relay/macro";

export const MILESTONE_TEMPLATE_FRAGMENT = graphql`
	fragment editMilestoneTemplateDataButton_MilestoneTemplateFragment on MilestoneTemplate {
		id
		data {
			name
			timeInPercent
		}
	}
`;

export const EDIT_MILESTONE_TEMPLATE_DATA_MUTATION = graphql`
	mutation editMilestoneTemplateDataButton_EditMilestoneTemplateDataMutation(
		$input: EditMilestoneTemplateDataInput!
	) {
		MilestoneTemplate {
			editMilestoneTemplateData(input: $input) {
				response {
					kind
					... on GoodEditMilestoneTemplateDataResponse {
						milestoneTemplate {
							...milestoneTemplatesTable_MilestoneTemplateInlineFragment
						}
						updatedAssignmentRoleIds {
							name
							...editAssignmentRoleButton_AssignmentRoleFragment
						}
					}
					... on WarningEditMilestoneTemplateDataResponseType {
						warnings {
							milestoneTemplate {
								...milestoneTemplatesTable_MilestoneTemplateInlineFragment
							}
							assignmentRoles {
								name
							}
						}
					}
				}
			}
		}
	}
`;
