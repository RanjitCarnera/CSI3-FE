import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query cucField_Query($id: ID!) {
		node(id: $id) {
			... on AssignmentRole {
				id
				cucTemplate {
					cuc {
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
			}
		}
	}
`;

export const CUC_TEMPLATE_QUERY = graphql`
	query cucField_CucTemplateQuery($id: ID!) {
		node(id: $id) {
			... on CucTemplate {
				id
				cuc {
					...EditAssignmentButton_CUCInlineFragment
				}
			}
		}
	}
`;

export const PROJECT_FRAGMENT = graphql`
	fragment cucField_ProjectFragment on Project {
		...cucFieldContext_ProjectFragment
		...importProjectMilestoneMarkerForm_ProjectFragment
	}
`;

export const ASSIGNMENT_FRAGMENT = graphql`
	fragment cucField_AssignmentFragment on Assignment {
		...cucFieldContext_AssignmentFragment
	}
`;
