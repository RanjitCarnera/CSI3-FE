import { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDispatch, useSelector } from "react-redux";
import { useFragment, useLazyLoadQuery } from "react-relay";
import { useMatch } from "react-router-dom";
import { QUERY, SCENARIO_QUERY } from "@screens/map-view/scenario-map-view-screen.graphql";
import { ProjectMapPart } from "./parts/ProjectMap.part";
import { type scenarioMapViewScreen_Query } from "../../__generated__/scenarioMapViewScreen_Query.graphql";
import { type scenarioMapViewScreen_ScenarioFragment$key } from "../../__generated__/scenarioMapViewScreen_ScenarioFragment.graphql";
import { DashboardHeader } from "../../components/relay/DashboardHeader";
import { BaseScreen } from "../../components/ui/base-screen";
import { RedirectTo } from "../../navigation/RedirectTo";
import { selectScenarioPeopleFilters, setSelectedProjectId } from "../../redux/ProjectViewSlice";
import { RosterPart } from "../project-view/parts/roster-part";

export const SCENARIO_MAP_VIEW_SCREEN_ROUTE = "/scenarios/:scenarioId/map/:projectId";

export const ScenarioMapViewScreen = () => {
	const {
		params: { scenarioId, projectId },
	} = useMatch(SCENARIO_MAP_VIEW_SCREEN_ROUTE)!;

	const dispatch = useDispatch();
	const scenarioPeopleFilters = useSelector(selectScenarioPeopleFilters);

	const query = useLazyLoadQuery<scenarioMapViewScreen_Query>(
		QUERY,
		{
			id: scenarioId!,
			sortByClosestToProject: projectId,
			filterByName: scenarioPeopleFilters.filterByName,
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
			utilizationWindow:
				scenarioPeopleFilters.startDate && scenarioPeopleFilters.endDate
					? {
							utilizationStart: scenarioPeopleFilters.startDate,
							utilizationEnd: scenarioPeopleFilters.endDate,
					  }
					: undefined,
		},
		{ fetchPolicy: "store-and-network" },
	);

	const scenario = useFragment<scenarioMapViewScreen_ScenarioFragment$key>(
		SCENARIO_QUERY,
		query.node,
	);

	const project = scenario?.projects?.edges?.find((e) => e?.node.id === projectId)?.node;

	useEffect(() => {
		if (project) {
			dispatch(setSelectedProjectId(project.project?.id));
		}
		// eslint-disable-next-line
	}, [project]);

	return scenario && project ? (
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
						<RosterPart
							className="h-full"
							scenarioFragmentRef={scenario}
							staffFragmentRef={query}
							queryRef={query}
						/>
					</div>

					<div className="flex-grow-1 h-full">
						<ProjectMapPart
							scenarioFragmentRef={scenario}
							projectFragmentRef={project}
						/>
					</div>
				</div>
			</DndProvider>
		</BaseScreen>
	) : (
		<RedirectTo to={"/"} />
	);
};
