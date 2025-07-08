import { graphql } from "babel-plugin-relay/macro";

export const SCENARIO_FRAGMENT = graphql`
	fragment rosterListActiveFilters_ScenarioFragment on Scenario {
		utilization {
			personUtilizations {
				status
			}
		}
	}
`;
export const QUERY_FRAGMENT = graphql`
	fragment rosterListActiveFilters_DivisionRegionFragment on Query {
		Skills {
			Skills {
				edges {
					node {
						id
						name
						skillCategory {
							id
							name
							sortOrder
						}
					}
				}
			}
			SkillCategories {
				edges {
					node {
						id
						name
						sortOrder
					}
				}
			}
		}
		Assignments {
			AssignmentRoles {
				edges {
					node {
						id
						name
					}
				}
			}
		}
		Division {
			Divisions {
				edges {
					node {
						id
						name
					}
				}
			}
		}
		Region {
			Regions {
				edges {
					node {
						id
						name
						...rosterListActiveFilters_RegionFragment
					}
				}
			}
		}
	}
`;

const REGION_FRAGMENT = graphql`
	fragment rosterListActiveFilters_RegionFragment on Region {
		id
		name
	}
`;
