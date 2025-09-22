import { graphql } from "babel-plugin-relay/macro";
import { OverlayPanel } from "primereact/overlaypanel";
import { classNames } from "primereact/utils";
import React, { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useFragment, useLazyLoadQuery } from "react-relay";
import { useLocation } from "react-router-dom";
import { type ScenarioStatistics_Query } from "@relay/ScenarioStatistics_Query.graphql";
import {
	type PersonOnAssignmentFiltersInput,
	type ProjectWithAssignmentsFiltersInput,
} from "@relay/staffViewPart_Query.graphql";
import { useProjectViewPersonOnAssignmentFiltersInput } from "@screens/project-view/parts/use-project-view-person-on-assignment-filters-input.hook";
import { useProjectViewProjectWithAssignmentsFiltersInput } from "@screens/project-view/parts/use-project-view-project-with-assignments-filters-input.hook";
import { useStaffViewPersonOnAssignmentFiltersInput } from "@screens/staff-view/parts/staff-view-part/parts/use-staff-view-person-on-assignment-filters-input.hook";
import { useStaffViewProjectWithAssignmentsFiltersInput } from "@screens/staff-view/parts/staff-view-part/parts/use-staff-view-project-with-assignments-filters-input.hook";
import { GapDaysDisplay } from "./GapDaysDisplay";
import { UtilizationDisplay } from "./UtilizationDisplay";
import { type ScenarioStatistics_ScenarioFragment$key } from "../../__generated__/ScenarioStatistics_ScenarioFragment.graphql";
import { selectHasPermissions } from "../../redux/CurrentUserSlice";
import { TkButton } from "../ui/TkButton";

const QUERY = graphql`
	query ScenarioStatistics_Query(
		$id: ID!
		$peopleOnAssignmentFilters: PersonOnAssignmentFiltersInput
		$projectWithAssignmentsFilters: ProjectWithAssignmentsFiltersInput
	) {
		node(id: $id) {
			... on Scenario {
				gapDaysWithFilters(
					peopleOnAssignmentFilters: $peopleOnAssignmentFilters
					projectWithAssignmentsFilters: $projectWithAssignmentsFilters
				) {
					...GapDaysDisplay_GapDaysFragment
				}
				utilizationWithFilters(
					peopleOnAssignmentFilters: $peopleOnAssignmentFilters
					projectWithAssignmentsFilters: $projectWithAssignmentsFilters
				) {
					...UtilizationDisplay_UtilizationFragment
				}
			}
		}
	}
`;

const FRAGMENT = graphql`
	fragment ScenarioStatistics_ScenarioFragment on Scenario {
		id
	}
`;

interface OwnProps {
	className?: string;
	scenarioFragmentRef: ScenarioStatistics_ScenarioFragment$key;
}

export const ScenarioStatistics = ({ className, scenarioFragmentRef }: OwnProps) => {
	const scenario = useFragment<ScenarioStatistics_ScenarioFragment$key>(
		FRAGMENT,
		scenarioFragmentRef,
	);
	const projectViewPersonOnAssignmentFilters = useProjectViewPersonOnAssignmentFiltersInput();
	const projectViewProjectWithAssignmentsFilters =
		useProjectViewProjectWithAssignmentsFiltersInput();
	const staffViewPersonOnAssignmentFilters = useStaffViewPersonOnAssignmentFiltersInput();
	const staffViewProjectWithAssignmentsFiltersInput =
		useStaffViewProjectWithAssignmentsFiltersInput();

	const location = useLocation();
	const isProjectView = location.pathname.includes("/project-view");
	const isStaffView = location.pathname.includes("/staff-view");
	const isMapView = location.pathname.includes("/map");
	const isForecast = location.pathname.includes("/availability-forecast");

	const peopleOnAssignmentFilters: PersonOnAssignmentFiltersInput | null = useMemo(() => {
		if (isProjectView) return projectViewPersonOnAssignmentFilters;
		else if (isStaffView) return staffViewPersonOnAssignmentFilters;
		else if (isMapView) return projectViewPersonOnAssignmentFilters;
		return null;
	}, [
		isProjectView,
		isStaffView,
		isMapView,
		isForecast,
		projectViewPersonOnAssignmentFilters,
		staffViewPersonOnAssignmentFilters,
		projectViewPersonOnAssignmentFilters,
	]);

	const projectWithAssignmentsFilters: ProjectWithAssignmentsFiltersInput | null = useMemo(() => {
		if (isProjectView) return projectViewProjectWithAssignmentsFilters;
		else if (isStaffView) return staffViewProjectWithAssignmentsFiltersInput;
		else if (isMapView) return projectViewProjectWithAssignmentsFilters;
		return null;
	}, [
		isProjectView,
		isStaffView,
		isMapView,
		isForecast,
		projectViewProjectWithAssignmentsFilters,
		staffViewProjectWithAssignmentsFiltersInput,
	]);

	const query = useLazyLoadQuery<ScenarioStatistics_Query>(QUERY, {
		id: scenario.id,
		peopleOnAssignmentFilters,
		projectWithAssignmentsFilters,
	});

	const op = useRef<OverlayPanel>(null);
	const hasPermissions = useSelector(selectHasPermissions);
	const gapDaysEnabled = hasPermissions(["AccountPermission_Auth_GapDaysEnabled"]);

	return (
		<div className={classNames(className)}>
			<TkButton
				className="p-1"
				icon="pi pi-chart-line"
				tooltip={"Scenario statistics"}
				onClick={(e) => op.current?.toggle(e)}
			/>

			<OverlayPanel ref={op} style={{ minWidth: 300 }}>
				<div className="flex flex-column">
					{gapDaysEnabled && query.node?.gapDaysWithFilters && (
						<GapDaysDisplay
							className="mb-2"
							gapDaysFragmentRef={query.node?.gapDaysWithFilters}
						/>
					)}
					{query.node?.utilizationWithFilters && (
						<UtilizationDisplay
							utilizationFragmentRef={query.node?.utilizationWithFilters}
						/>
					)}
				</div>
			</OverlayPanel>
		</div>
	);
};
