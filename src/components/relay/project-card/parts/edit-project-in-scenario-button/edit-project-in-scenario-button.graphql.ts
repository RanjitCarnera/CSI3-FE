import { graphql } from "babel-plugin-relay/macro";

export const EDIT_PROJECT_IN_SCENARIO_MUTATION = graphql`
	mutation editProjectInScenarioButton_editProjectInScenarioMutation(
		$input: EditProjectInScenarioInput!
	) {
		Project {
			editProjectInScenario(input: $input) {
				assignmentUpdate {
					project {
						project {
							...editProjectButton_ProjectFragment
							...editProjectInScenarioButton_ProjectFragment
						}
						assignments {
							edges {
								node {
									cuc {
										...EditAssignmentButton_CUCInlineFragment
									}
									...EditAssignmentButton_AssignmentFragment
								}
							}
						}
					}
					scenario {
						...AssignmentCard_ScenarioFragment
					}
				}
			}
		}
	}
`;

export const PROJECT_FRAGMENT = graphql`
	fragment editProjectInScenarioButton_ProjectFragment on Project {
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
