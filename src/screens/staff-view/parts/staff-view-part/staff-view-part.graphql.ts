import { graphql } from "babel-plugin-relay/macro";

export const STAFF_VIEW_QUERY = graphql`
	query staffViewPart_Query(
		$id: ID!
		$intervalType: IntervalType!
		$personFiltersOpt: PersonOnAssignmentFiltersInput
		$projectFiltersOpt: ProjectWithAssignmentsFiltersInput
		$showAll: Boolean
		$sort: StaffViewSort
		$utilizationWindow: UtilizationWindowInput
		$sortWithTags: Boolean
	) {
		node(id: $id) {
			... on Scenario {
				...staffViewPart_ScenarioFragment
					@arguments(
						scenarioId: $id
						intervalType: $intervalType
						personFiltersOpt: $personFiltersOpt
						projectFiltersOpt: $projectFiltersOpt
						showAll: $showAll
						sort: $sort
						utilizationWindow: $utilizationWindow
						sortWithTags: $sortWithTags
					)
			}
		}
	}
`;

export const SCENARIO_FRAGMENT = graphql`
	fragment staffViewPart_ScenarioFragment on Scenario
	@argumentDefinitions(
		scenarioId: { type: "ID!" }
		intervalType: { type: "IntervalType!" }
		showAll: { type: "Boolean" }
		personFiltersOpt: { type: "PersonOnAssignmentFiltersInput" }
		projectFiltersOpt: { type: "ProjectWithAssignmentsFiltersInput" }
		sort: { type: "StaffViewSort" }
		utilizationWindow: { type: "UtilizationWindowInput" }
		sortWithTags: { type: "Boolean" }
	)
	@refetchable(queryName: "staffViewPart_RefetchQuery") {
		staffView(
			intervalType: $intervalType
			showAll: $showAll
			sort: $sort
			projectWithAssignmentsFilters: $projectFiltersOpt
			peopleOnAssignmentFilters: $personFiltersOpt
			utilizationWindow: $utilizationWindow
			sortWithTags: $sortWithTags
		) {
			intervalType
			intervals {
				index
				...IntervalHeaderComponent_IntervalFragment
				...allocationBarProvider_IntervalFragment
			}
			allocationGroups {
				groupType
				allocations {
					... on StaffViewAllocation {
						lanes {
							allocations {
								id
								assignment {
									person {
										id
										name
									}
									id
									tags {
										id
									}
								}
								startDate
								endDate

								...allocationBarProvider_AllocationFragment
							}
						}
						gapDays
					}
					... on PersonAllocation {
						person {
							id
							assignmentRole {
								id
								name
							}
							name
							sumOfProjectVolume(scenarioRef: $scenarioId)
							...personCard_PersonFragment @arguments(scenarioId: $scenarioId)
						}
					}
					... on UnfilledAllocation {
						assignmentRole {
							id
							name
						}
					}
				}
				... on ProjectGroup {
					project {
						name
					}
				}
				... on AssignmentRoleGroup {
					assignmentRole {
						name
					}
				}
			}
		}
		utilizationWithStandAndEndDate(utilizationWindow: $utilizationWindow) {
			...personCard_ScenarioUtilizationFragment
		}
		...personCard_ScenarioFragment
		...allocationBarProvider_ScenarioFragment
	}
`;
