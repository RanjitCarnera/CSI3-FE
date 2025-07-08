import { graphql } from "babel-plugin-relay/macro";

export const EDIT_MUTATION = graphql`
	mutation editProjectButton_EditMutation($input: EditProjectInput!) {
		Project {
			editProject(input: $input) {
				edge {
					node {
						id
						...editProjectButton_ProjectFragment
					}
				}
				changedAssignments {
					...AssignmentProjectCard_AssignmentFragment
					cuc {
						...EditAssignmentButton_CUCInlineFragment
					}
				}
			}
		}
	}
`;

export const PROJECT_FRAGMENT = graphql`
	fragment editProjectButton_ProjectFragment on Project {
		id
		name
		startDate
		endDate
		address {
			lineOne
			city
			postalCode
			state
			country
			latitude
			longitude
		}
		source
		architectName
		clientName
		stage {
			id
			name
		}
		skills {
			id
		}
		volume
		generalConditionsPercentage
		budgetedLaborCosts
		division {
			id
		}
		region {
			id
		}
		projectIdentifier
		durationInMonths
		avatar {
			id
			url
		}
		milestones {
			id
			data {
				name
				date
			}
		}
		comments
		source
	}
`;
