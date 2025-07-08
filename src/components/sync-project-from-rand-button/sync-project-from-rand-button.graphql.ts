import { graphql } from "babel-plugin-relay/macro";

export const SYNC_MUTATION = graphql`
	mutation syncProjectFromRandButton_SyncFromRandMutation($input: LoadProjectDataFromRandInput!) {
		Rand {
			loadProjectDataFromRand(input: $input) {
				edge {
					node {
						...ProjectsTable_ProjectFragment
						...syncProjectFromRandButton_SyncProjectFragment
					}
				}
			}
		}
	}
`;

export const EDIT_MUTATION = graphql`
	mutation syncProjectFromRandButton_EditMutation($input: EditProjectInput!) {
		Project {
			editProject(input: $input) {
				edge {
					node {
						...ProjectsTable_ProjectFragment
						...syncProjectFromRandButton_SyncProjectFragment
					}
				}
			}
		}
	}
`;

export const PROJECT_FRAGMENT = graphql`
	fragment syncProjectFromRandButton_ProjectFragment on Project {
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
		source
	}
`;

export const PROJECT_SYNC_FRAGMENT = graphql`
	fragment syncProjectFromRandButton_SyncProjectFragment on Project @inline {
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
		source
	}
`;
