import { graphql } from "babel-plugin-relay/macro";
import { classNames } from "primereact/utils";
import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { useFragment } from "react-relay";
import styled from "styled-components";
import { type rosterPart_FilterFragment$key } from "@relay/rosterPart_FilterFragment.graphql";
import { type rosterPart_ScenarioFragment$key } from "@relay/rosterPart_ScenarioFragment.graphql";
import { type rosterPart_StaffFragment$key } from "@relay/rosterPart_StaffFragment.graphql";
import { RosterListActiveFilters } from "./parts/roster-list-active-filters";
import { RosterListFilters } from "./parts/roster-list-filters";
import { RosterList } from "../../../../components/relay/RosterList";
import { Loader } from "../../../../components/ui/Loader";
import { TkCard } from "../../../../components/ui/TkCard";
import { selectIsPeopleFilterVisible } from "../../../../redux/ProjectViewSlice";

const SCENARIO_FRAGMENT = graphql`
	fragment rosterPart_ScenarioFragment on Scenario {
		...RosterList_ScenarioFragment
		...rosterListActiveFilters_ScenarioFragment
	}
`;

const STAFF_FRAGMENT = graphql`
	fragment rosterPart_StaffFragment on Query
	@argumentDefinitions(
		scenarioRef: { type: "ID!" }
		first: { type: "Int", defaultValue: 250 }
		after: { type: "String" }
		filterByName: { type: "String" }
		filterByAssignmentRoles: { type: "[ID!]" }
		filterByUtilizationStatus: { type: "[UtilizationStatus!]" }
		filterBySalaryMinimum: { type: "BigDecimal" }
		filterBySalaryMaximum: { type: "BigDecimal" }
		filterByFreeDateMinimum: { type: "LocalDate" }
		filterByFreeDateMaximum: { type: "LocalDate" }
		filterByAllocatedDateMinimum: { type: "LocalDate" }
		filterByAllocatedDateMaximum: { type: "LocalDate" }
		filterByGapDaysMinimum: { type: "Int" }
		filterByGapDaysMaximum: { type: "Int" }
		filterByDistanceMinimum: { type: "Int" }
		filterByDistanceMaximum: { type: "Int" }
		filterBySkills: { type: "[SkillFilter!]" }
		sortByClosestToProject: { type: "ID" }
		filterByRegions: { type: "[ID!]" }
		filterByDivisions: { type: "[ID!]" }
		utilizationWindow: { type: "UtilizationWindowInput" }
		filterByStaff: { type: "[ID!]" }
	) {
		...RosterList_StaffFragment
			@arguments(
				first: $first
				after: $after
				filterByName: $filterByName
				scenarioRef: $scenarioRef
				filterBySkills: $filterBySkills
				filterByRegions: $filterByRegions
				filterByDivisions: $filterByDivisions
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
	}
`;

const ROSTER_LIST_FILTERS_FRAGMENT = graphql`
	fragment rosterPart_FilterFragment on Query {
		...rosterListActiveFilters_DivisionRegionFragment
	}
`;

interface OwnProps {
	className?: string;
	scenarioFragmentRef: rosterPart_ScenarioFragment$key;
	staffFragmentRef: rosterPart_StaffFragment$key;
	queryRef: rosterPart_FilterFragment$key;
}

export const RosterPart = ({
	className,
	scenarioFragmentRef,
	staffFragmentRef,
	queryRef,
}: OwnProps) => {
	const isFiltersVisible = useSelector(selectIsPeopleFilterVisible);

	const query = useFragment<rosterPart_FilterFragment$key>(
		ROSTER_LIST_FILTERS_FRAGMENT,
		queryRef,
	);
	const scenario = useFragment<rosterPart_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioFragmentRef,
	);
	const staff = useFragment<rosterPart_StaffFragment$key>(STAFF_FRAGMENT, staffFragmentRef);

	return (
		<RosterCard className={classNames("card-flat", className)}>
			<div
				className={classNames({
					"flex flex-column h-full": true,
					"overflow-y-auto": isFiltersVisible,
					"overflow-x-hidden": true,
				})}
			>
				<div className="flex align-items-center justify-content-between mb-2">
					<Heading className="m-0">Roster</Heading>
					<RosterListFilters />
				</div>
				<RosterListActiveFilters className="mb-2" queryRef={query} scenarioRef={scenario} />

				<Suspense fallback={<Loader />}>
					<RosterList scenarioFragmentRef={scenario} staffFragmentRef={staff} />
				</Suspense>
			</div>
		</RosterCard>
	);
};

export const RosterCard = styled(TkCard)`
	.p-card-content,
	.p-card-body {
		height: 100%;
		width: 100%;
	}
`;
const Heading = styled.h2`
	color: var(--text);
	font-size: 1.3rem;
	font-weight: normal;
`;
