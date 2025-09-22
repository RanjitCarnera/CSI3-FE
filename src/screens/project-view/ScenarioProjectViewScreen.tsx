import { graphql } from "babel-plugin-relay/macro";
import { Suspense, useEffect, useLayoutEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch, useSelector } from "react-redux";
import { useLazyLoadQuery, useRefetchableFragment } from "react-relay";
import { useMatch } from "react-router-dom";
import { LOCAL_STORAGE_KEY_CURRENT_SCENARIO } from "@components/ui/ChangeCurrentScenarioButton";
import { selectCurrentUser } from "@redux/CurrentUserSlice";
import { type ScenarioProjectViewScreen_Refetch } from "@relay/ScenarioProjectViewScreen_Refetch.graphql";
import { useProjectViewPersonOnAssignmentFiltersInput } from "@screens/project-view/parts/use-project-view-person-on-assignment-filters-input.hook";
import { useProjectViewProjectWithAssignmentsFiltersInput } from "@screens/project-view/parts/use-project-view-project-with-assignments-filters-input.hook";
import { useProjectViewUtilizationWindow } from "@utils/use-utilization-window.hook";
import { ProjectsGridPart } from "./parts/projects-grid-part/ProjectsGridPart.component";
import { RosterPart } from "./parts/roster-part";
import { type ScenarioProjectViewScreen_Query } from "../../__generated__/ScenarioProjectViewScreen_Query.graphql";
import { type ScenarioProjectViewScreen_ScenarioFragment$key } from "../../__generated__/ScenarioProjectViewScreen_ScenarioFragment.graphql";
import { DashboardHeader } from "../../components/relay/DashboardHeader";
import { BaseScreen } from "../../components/ui/base-screen";
import { Loader } from "../../components/ui/Loader";
import { RedirectTo } from "../../navigation/RedirectTo";
import {
	initializeFromDefaultView,
	initializeFromPreferredView,
	selectScenarioPeopleFilters,
	selectSelectedProjectId,
} from "../../redux/ProjectViewSlice";

const QUERY = graphql`
	query ScenarioProjectViewScreen_Query(
		$id: ID!
		$filterByName: String
		$filterByAssignmentRoles: [ID!]
		$filterByUtilizationStatus: [UtilizationStatus!]
		$filterBySalaryMinimum: BigDecimal
		$filterBySalaryMaximum: BigDecimal
		$filterByFreeDateMinimum: LocalDate
		$filterByFreeDateMaximum: LocalDate
		$filterByAllocatedDateMinimum: LocalDate
		$filterByAllocatedDateMaximum: LocalDate
		$filterByGapDaysMinimum: Int
		$filterByGapDaysMaximum: Int
		$filterByDistanceMinimum: Int
		$filterByDistanceMaximum: Int
		$sortByClosestToProject: ID
		$utilizationWindow: UtilizationWindowInput
		$filterByStaff: [ID!]
		$projectFilters: ProjectWithAssignmentsFiltersInput
		$peopleOnAssignmentFilters: PersonOnAssignmentFiltersInput
	) {
		node(id: $id) {
			... on Scenario {
				...ScenarioProjectViewScreen_ScenarioFragment
					@arguments(
						utilizationWindow: $utilizationWindow
						projectFilters: $projectFilters
						personOnAssignmentFilters: $peopleOnAssignmentFilters
					)
			}
		}
		...rosterPart_StaffFragment
			@arguments(
				filterByName: $filterByName
				scenarioRef: $id
				filterByAssignmentRoles: $filterByAssignmentRoles
				filterByUtilizationStatus: $filterByUtilizationStatus
				filterBySalaryMinimum: $filterBySalaryMinimum
				filterBySalaryMaximum: $filterBySalaryMaximum
				filterByFreeDateMinimum: $filterByFreeDateMinimum
				filterByFreeDateMaximum: $filterByFreeDateMaximum
				filterByAllocatedDateMinimum: $filterByAllocatedDateMinimum
				filterByAllocatedDateMaximum: $filterByAllocatedDateMaximum
				filterByGapDaysMinimum: $filterByGapDaysMinimum
				filterByGapDaysMaximum: $filterByGapDaysMaximum
				filterByDistanceMinimum: $filterByDistanceMinimum
				filterByDistanceMaximum: $filterByDistanceMaximum
				sortByClosestToProject: $sortByClosestToProject
				utilizationWindow: $utilizationWindow
				filterByStaff: $filterByStaff
			)
		...ProjectsGridPart_QueryFragment

		...baseScreen_QueryFragment
		...rosterPart_FilterFragment

		Views {
			ViewOptions(first: 20, filterByViewType: ProjectView)
				@connection(key: "FilterViewSelector_ViewOptions") {
				__id
				edges {
					node {
						id
						name
						viewType
						url
						isDefault
					}
				}
			}
		}
	}
`;

const SCENARIO_QUERY = graphql`
	fragment ScenarioProjectViewScreen_ScenarioFragment on Scenario
	@refetchable(queryName: "ScenarioProjectViewScreen_Refetch")
	@argumentDefinitions(
		utilizationWindow: { type: "UtilizationWindowInput" }
		projectFilters: { type: "ProjectWithAssignmentsFiltersInput" }
		personOnAssignmentFilters: { type: "PersonOnAssignmentFiltersInput" }
	) {
		id
		...ProjectsGridPart_ScenarioFragment
			@arguments(
				projectFilters: $projectFilters
				personOnAssignmentFilters: $personOnAssignmentFilters
			)
		...rosterPart_ScenarioFragment @arguments(utilizationWindow: $utilizationWindow)
		...DashboardHeader_ScenarioFragment
	}
`;
export const SCENARIO_PROJECT_VIEW_SCREEN_ROUTE = "/scenarios/:scenarioId/project-view";

export const ScenarioProjectViewScreen = () => {
	const cu = useSelector(selectCurrentUser);
	const dispatch = useDispatch();
	const {
		params: { scenarioId },
	} = useMatch(SCENARIO_PROJECT_VIEW_SCREEN_ROUTE)!;

	const selectedProject = useSelector(selectSelectedProjectId);
	const projectFilters = useProjectViewProjectWithAssignmentsFiltersInput();
	const scenarioPeopleFilters = useSelector(selectScenarioPeopleFilters);

	const utilizationWindow = useProjectViewUtilizationWindow();
	const personOnAssignmentFiltersInput = useProjectViewPersonOnAssignmentFiltersInput();
	const query = useLazyLoadQuery<ScenarioProjectViewScreen_Query>(
		QUERY,
		{
			id: scenarioId!,
			sortByClosestToProject: selectedProject,
			filterByAssignmentRoles: scenarioPeopleFilters.filterByAssignmentRoles,
			filterByUtilizationStatus: scenarioPeopleFilters.filterByUtilizationStatus,
			filterBySalaryMinimum: scenarioPeopleFilters.filterBySalaryMinimum,
			filterBySalaryMaximum: scenarioPeopleFilters.filterBySalaryMaximum,
			filterByFreeDateMinimum: scenarioPeopleFilters.filterByFreeDateMinimum,
			filterByFreeDateMaximum: scenarioPeopleFilters.filterByFreeDateMaximum,
			filterByAllocatedDateMinimum: scenarioPeopleFilters.filterByAllocatedDateMinimum,
			filterByAllocatedDateMaximum: scenarioPeopleFilters.filterByAllocatedDateMaximum,
			filterByGapDaysMinimum: scenarioPeopleFilters.filterByGapDaysMinimum,
			filterByGapDaysMaximum: scenarioPeopleFilters.filterByGapDaysMaximum,
			filterByDistanceMinimum: scenarioPeopleFilters.filterByDistanceMinimum,
			filterByDistanceMaximum: scenarioPeopleFilters.filterByDistanceMaximum,
			filterByStaff: scenarioPeopleFilters.filterByStaff,
			utilizationWindow,
			projectFilters,
			peopleOnAssignmentFilters: personOnAssignmentFiltersInput,
		},
		{
			fetchPolicy: "store-and-network",
		},
	);

	const [scenario, refetch] = useRefetchableFragment<
		ScenarioProjectViewScreen_Refetch,
		ScenarioProjectViewScreen_ScenarioFragment$key
	>(SCENARIO_QUERY, query.node);

	// TODO: -> onchange
	const dep = JSON.stringify({
		...utilizationWindow,
		...personOnAssignmentFiltersInput,
		...projectFilters,
		scenarioId,
	});

	const [initialLoad, setInitialLoad] = useState(true);
	useEffect(() => {
		if (initialLoad) {
			setInitialLoad(false);
			return;
		}
		refetch(
			{
				id: scenarioId,
				utilizationWindow,
				projectFilters,
				personOnAssignmentFilters: personOnAssignmentFiltersInput,
			},
			{ fetchPolicy: "store-and-network" },
		);
	}, [dep]);

	useLayoutEffect(() => {
		if (!scenario?.id) {
			window.location.reload();
			return;
		}
		if (cu?.user?.extension?.preferredViewType) {
			dispatch(
				initializeFromPreferredView({
					scenarioId: scenario.id,
					preferredViewType: cu.user.extension.preferredViewType,
				}),
			);
		}
	}, [scenario?.id]);

	useEffect(() => {
		if (!scenario?.id) return;
		const viewOptions = query.Views.ViewOptions.edges?.map((e) => e?.node);
		const defaultView = viewOptions?.find((e) => e?.isDefault);
		dispatch(initializeFromDefaultView(defaultView));
	}, [scenario?.id]);

	if (!scenario) {
		window.localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT_SCENARIO);
		return <RedirectTo to={"/"} />;
	}
	return (
		<BaseScreen
			queryFragmentRef={query}
			headerComponents={<DashboardHeader scenarioFragmentRef={scenario} />}
		>
			<DndProvider backend={HTML5Backend}>
				<div className="flex h-full">
					<div
						className="flex-grow-0 mr-5 h-full hide-print"
						style={{ minWidth: 300, maxWidth: 300 }}
					>
						<Suspense fallback={<Loader />}>
							<RosterPart
								className="h-full"
								scenarioFragmentRef={scenario}
								staffFragmentRef={query}
								queryRef={query}
							/>
						</Suspense>
					</div>

					<div className="flex-grow-1 h-full">
						<Suspense fallback={<Loader />}>
							<ProjectsGridPart
								queryFragmentRef={query}
								className="h-full"
								scenarioFragmentRef={scenario}
							/>
						</Suspense>
					</div>
				</div>
			</DndProvider>
		</BaseScreen>
	);
};
