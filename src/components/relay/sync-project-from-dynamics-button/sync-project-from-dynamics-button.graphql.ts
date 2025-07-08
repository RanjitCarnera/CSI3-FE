import { graphql } from "babel-plugin-relay/macro";

export const SYNC_MUTATION = graphql`
	mutation syncProjectFromDynamicsButton_SyncFromDynamicsMutation(
		$input: LoadProjectDataFromDynamicsInput!
	) {
		Dynamics {
			loadProjectDataFromDynamics(input: $input) {
				edge {
					node {
						...ProjectsTable_ProjectFragment
						...syncProjectFromDynamicsButton_SyncProjectFragment
					}
				}
			}
		}
	}
`;

export const EDIT_MUTATION = graphql`
	mutation syncProjectFromDynamicsButton_EditMutation($input: EditProjectInput!) {
		Project {
			editProject(input: $input) {
				edge {
					node {
						...ProjectsTable_ProjectFragment
						...syncProjectFromDynamicsButton_SyncProjectFragment
					}
				}
			}
		}
	}
`;

export const PROJECT_FRAGMENT = graphql`
	fragment syncProjectFromDynamicsButton_ProjectFragment on Project {
		id
		name
		address {
			lineOne
			city
			postalCode
			state
			country
			latitude
			longitude
		}
		projectIdentifier
		architectName
		avatar {
			id
			url
		}
		skills {
			id
		}
		clientName
		startDate
		endDate
		division {
			id
		}
		region {
			id
		}
		stage {
			id
		}
		volume
		generalConditionsPercentage
		budgetedLaborCosts
		milestones {
			id
			data {
				name
				date
			}
		}
		comments
	}
`;

export const PROJECT_SYNC_FRAGMENT = graphql`
	fragment syncProjectFromDynamicsButton_SyncProjectFragment on Project @inline {
		id
		name
		address {
			lineOne
			city
			postalCode
			state
			country
			latitude
			longitude
		}
		projectIdentifier
		architectName
		avatar {
			id
			url
		}
		skills {
			id
		}
		clientName
		startDate
		endDate
		division {
			id
		}
		region {
			id
		}
		stage {
			id
		}
		volume
		generalConditionsPercentage
		budgetedLaborCosts
		milestones {
			id
			data {
				name
				date
			}
		}
		comments
	}
`;
