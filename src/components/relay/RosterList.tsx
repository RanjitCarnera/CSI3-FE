import { graphql } from "babel-plugin-relay/macro";
import React, { memo, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFragment, usePaginationFragment } from "react-relay";
import { match } from "ts-pattern";
import { PersonCard } from "@components/person-card";
import { DraggablePersonCard } from "@components/person-card/parts/person-card-draggable";
import { selectCurrentUser } from "@redux/CurrentUserSlice";
import { useProjectViewUtilizationWindow } from "@utils/use-utilization-window.hook";
import { CheckScenarioPermissions } from "./CheckScenarioPermissions";
import { type RosterList_ScenarioFragment$key } from "../../__generated__/RosterList_ScenarioFragment.graphql";
import { type RosterList_StaffFragment$key } from "../../__generated__/RosterList_StaffFragment.graphql";
import { type Person, setFetchedPeople } from "../../redux/MapSlice";
import {
	selectScenarioPeopleFilters,
	selectScenarioProjectFilters,
	selectSelectedProjectId,
} from "../../redux/ProjectViewSlice";
import { LoadDriveTimesButton } from "../../screens/map-view/parts/LoadDriveTimesButton";
import { DriveTimeDisplay } from "../ui/DriveTimeDisplay";
import { TkButtonLink } from "../ui/TkButtonLink";

const SCENARIO_FRAGMENT = graphql`
	fragment RosterList_ScenarioFragment on Scenario {
		id
		...CheckScenarioPermissions_ScenarioFragment
		...personCardDraggable_ScenarioFragment
		...personCard_ScenarioFragment

		utilization {
			...personCard_ScenarioUtilizationFragment
		}
	}
`;

const STAFF_FRAGMENT = graphql`
	fragment RosterList_StaffFragment on Query
	@refetchable(queryName: "RosterList_StaffRefetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 250 }
		after: { type: "String" }
		filterByName: { type: "String" }
		scenarioRef: { type: "ID!" }
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
		filterByStaff: { type: "[ID!]" }
		sortByClosestToProject: { type: "ID" }
		filterByRegions: { type: "[ID!]" }
		filterByDivisions: { type: "[ID!]" }
		utilizationWindow: { type: "UtilizationWindowInput" }
	) {
		node(id: $scenarioRef) {
			... on Scenario {
				utilizationWithStandAndEndDate(utilizationWindow: $utilizationWindow) {
					...personCard_ScenarioUtilizationFragment
				}
			}
		}
		Staff {
			People(
				first: $first
				after: $after
				filterByName: $filterByName
				scenarioRef: $scenarioRef
				alwaysIncludeIds: $filterByStaff
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
				filterBySkills: $filterBySkills
				sortByClosestToProject: $sortByClosestToProject
				filterByDivisions: $filterByDivisions
				filterByRegions: $filterByRegions
				utilizationWindow: $utilizationWindow
			) @connection(key: "RosterList_People") {
				pageInfo {
					endCursor
					hasPreviousPage
					hasNextPage
					startCursor
				}
				edges {
					node {
						id
						...personCardDraggable_PersonFragment @arguments(scenarioId: $scenarioRef)
						...personCard_PersonFragment @arguments(scenarioId: $scenarioRef)

						distance(projectRef: $sortByClosestToProject)
						name
						address {
							latitude
							longitude
							lineOne
							postalCode
							city
							state
						}
					}
				}
			}
		}
	}
`;

interface OwnProps {
	scenarioFragmentRef: RosterList_ScenarioFragment$key;
	staffFragmentRef: RosterList_StaffFragment$key;
}

export const RosterList = memo(({ staffFragmentRef, scenarioFragmentRef }: OwnProps) => {
	const scenario = useFragment<RosterList_ScenarioFragment$key>(
		SCENARIO_FRAGMENT,
		scenarioFragmentRef,
	);
	const [initialLoad, setInitialLoadComplete] = useState(true);
	const dispatch = useDispatch();
	const filters = useSelector(selectScenarioPeopleFilters);
	const projectViewFilters = useSelector(selectScenarioProjectFilters);
	const selectedProjectId = useSelector(selectSelectedProjectId);
	const utilizationWindow = useProjectViewUtilizationWindow();

	const { data, hasNext, refetch, loadNext } = usePaginationFragment<
		any,
		RosterList_StaffFragment$key
	>(STAFF_FRAGMENT, staffFragmentRef);
	const people = data.Staff.People.edges?.map((e) => e!.node!) ?? [];

	const cu = useSelector(selectCurrentUser);
	const formatDistance = (distance: number) => {
		return (
			`${distance} ` +
			match(cu?.user.extension.unitSystem)
				.with("Metric", () => "km")
				.with("Imperial", () => "mi")
				.otherwise(() => "mi")
		);
	};

	useEffect(() => {
		if (initialLoad) {
			setInitialLoadComplete(false);
		} else if (filters) {
			refetch(
				{
					...filters,
					filterByName: filters.filterByName,
					alwaysIncludeIds: filters.filterByStaff,
					scenarioRef: scenario.id,
					first: 251,
					sortByClosestToProject: selectedProjectId,
					utilizationWindow,
				},
				{ fetchPolicy: "store-and-network" },
			);
		}
		// eslint-disable-next-line
	}, [filters, selectedProjectId, projectViewFilters]);

	useEffect(() => {
		const newPeople: Person[] = people.map((p) => ({
			id: p.id,
			name: p.name,
			address: {
				latitude: p.address?.latitude ?? 0,
				longitude: p.address?.longitude ?? 0,
				lineOne: p.address?.lineOne ?? "",
				postalCode: p.address?.postalCode ?? "",
				city: p.address?.city ?? "",
				state: p.address?.state ?? "",
			},
		}));
		dispatch(setFetchedPeople(newPeople));
	}, [dispatch, people]);

	return (
		<div className="overflow-y-auto overflow-x-hidden">
			{selectedProjectId && people.length > 0 && (
				<div
					style={{
						position: "sticky",
						top: 0,
						zIndex: 5,
					}}
				>
					<Suspense fallback={<div />}>
						<LoadDriveTimesButton
							className="w-12 mb-3"
							selectedProjectId={selectedProjectId}
						/>
					</Suspense>
				</div>
			)}

			{people.length === 0 && (
				<div>
					There were no results. Add people to your roster or change your filter settings.
				</div>
			)}
			{people.map((person) => {
				const DistanceDisplay =
					person.distance && selectedProjectId && person.distance < 10000 ? (
						<div className="text-sm pl-1">
							Distance {formatDistance(parseInt(person.distance.toFixed(0)))}
						</div>
					) : null;

				return (
					<CheckScenarioPermissions
						key={person.id}
						scenarioFragmentRef={scenario}
						requiredPermission={"UserInAccountPermission_Scenario_Edit"}
						alternative={
							<PersonCard
								scenarioFragmentRef={scenario}
								personFragmentRef={person}
								hideTotalVolume
								scenarioUtilizationRef={scenario.utilization}
							>
								{DistanceDisplay}
								<DriveTimeDisplay
									personId={person.id}
									projectId={selectedProjectId}
								/>
							</PersonCard>
						}
					>
						<DraggablePersonCard
							scenarioFragmentRef={scenario}
							personFragmentRef={person}
							hideTotalVolume
						>
							{DistanceDisplay}
							<DriveTimeDisplay personId={person.id} projectId={selectedProjectId} />
						</DraggablePersonCard>
					</CheckScenarioPermissions>
				);
			})}

			{hasNext && (
				<div className="flex justify-content-center align-items-center">
					<TkButtonLink type="button" disabled={!hasNext} onClick={() => loadNext(20)}>
						Load more
					</TkButtonLink>
				</div>
			)}
		</div>
	);
});
