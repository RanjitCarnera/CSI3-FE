import graphql from "babel-plugin-relay/macro";
import debounce from "lodash.debounce";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { CheckScenarioPermissions } from "./CheckScenarioPermissions";
import { CloneScenarioButton } from "./CloneScenarioButton";
import { DeleteScenariosButton } from "./DeleteScenariosButton";
import { EditScenarioButton } from "./EditScenarioButton";
import { ExportScenariosButton } from "./ExportScenariosButton";
import { ImportScenariosButton } from "./ImportScenariosButton";
import { MakeMasterPlanButton } from "./MakeMasterPlanButton";
import { ToggleVisibilityButton } from "./ToggleVisibilityButton";
import { type ScenariosTable_Query } from "../../__generated__/ScenariosTable_Query.graphql";
import { type ScenariosTable_Refetch } from "../../__generated__/ScenariosTable_Refetch.graphql";
import { type ScenariosTable_ScenarioFragment$key } from "../../__generated__/ScenariosTable_ScenarioFragment.graphql";
import { type ScenariosTable_ScenariosListFragment$key } from "../../__generated__/ScenariosTable_ScenariosListFragment.graphql";
import { type ScenarioFilters, selectScenarioFilters } from "../../redux/ScenarioSlice";
import { CreateScenarioButton } from "../ui/CreateScenarioButton";
import { DateTimeDisplay } from "../ui/DateTimeDisplay";
import { TkDataTable } from "../ui/TkDataTable";
import { TkTag } from "../ui/TkTag";

const QUERY = graphql`
	query ScenariosTable_Query($first: Int, $filterByName: String) {
		...ScenariosTable_ScenariosListFragment
			@arguments(first: $first, filterByName: $filterByName)
	}
`;

const FRAGMENT = graphql`
	fragment ScenariosTable_ScenariosListFragment on Query
	@refetchable(queryName: "ScenariosTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 20 }
		after: { type: "String" }
		filterByName: { type: "String" }
	) {
		Scenario {
			Scenarios(first: $first, after: $after, filterByName: $filterByName)
				@connection(key: "ScenariosTable_Scenarios") {
				__id
				pageInfo {
					endCursor
					hasPreviousPage
					hasNextPage
					startCursor
				}
				edges {
					node {
						id
						...ScenariosTable_ScenarioFragment
					}
				}
			}
		}
	}
`;

const SCENARIO_FRAGMENT = graphql`
	fragment ScenariosTable_ScenarioFragment on Scenario @inline {
		id
		name
		isMasterPlan
		lastUpdatedAt
		...EditScenarioButton_ScenarioFragment
		...CheckScenarioPermissions_ScenarioFragment
		...MakeMasterPlanButton_ScenarioFragment
		...CloneScenarioButton_ScenarioFragment
		...ToggleVisibilityButton_ScenarioFragment
	}
`;

export const ScenariosTable = () => {
	const filters = useSelector(selectScenarioFilters);

	const [initialLoad, setInitialLoadComplete] = useState(true);
	const data = useLazyLoadQuery<ScenariosTable_Query>(QUERY, { first: 20, ...filters });

	const {
		data: {
			Scenario: {
				Scenarios: { __id, edges: projects },
			},
		},
		hasNext,
		refetch,
		loadNext,
	} = usePaginationFragment<ScenariosTable_Refetch, ScenariosTable_ScenariosListFragment$key>(
		FRAGMENT,
		data,
	);

	const debouncedRefetch = (filters: ScenarioFilters) => {
		refetch({ ...filters, first: 20 }, { fetchPolicy: "network-only" });
	};

	const debouncedEventHandler = useMemo(
		() => debounce(debouncedRefetch, 1000),
		// eslint-disable-next-line
		[],
	);

	useEffect(() => {
		if (initialLoad) {
			setInitialLoadComplete(false);
		} else {
			debouncedEventHandler(filters);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters]);
	const [selection, setSelection] = useState<Array<{ id: string }>>([]);

	const projectData =
		projects
			?.map((b) => b!.node!)
			.map((n) =>
				readInlineData<ScenariosTable_ScenarioFragment$key>(SCENARIO_FRAGMENT, n),
			) || [];
	return (
		<>
			<div className="flex justify-content-end gap-2">
				<ImportScenariosButton />
				<ExportScenariosButton />
				<CreateScenarioButton connectionId={__id} />
				<DeleteScenariosButton
					isDeletingMasterPlan={
						projectData.find(
							(p) => p.isMasterPlan && selection.find((s) => s.id === p.id),
						) !== undefined
					}
					scenarioIds={selection.map((s) => s.id)}
					connectionIds={[__id]}
				/>
			</div>
			<TkDataTable
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">There are not scenarios yet.</div>
					</div>
				}
				className="mb-3"
				value={projectData}
				selectionMode="multiple"
				onSelectionChange={(e) => {
					// @ts-expect-error
					setSelection(e.value);
				}}
				selection={selection}
			>
				<Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>
				<Column
					header="Name"
					sortable
					sortField={"name"}
					body={(row) => {
						return (
							<div className="flex align-items-center">
								{row.name}{" "}
								{row.isMasterPlan && <TkTag className="ml-2">MASTER</TkTag>}
							</div>
						);
					}}
				/>
				<Column
					header="Last updated"
					sortable
					sortField={"lastUpdatedAt"}
					body={(row) => {
						return <DateTimeDisplay value={row.lastUpdatedAt} />;
					}}
				/>
				<Column
					header="Actions"
					body={(row) => {
						return (
							<div className="flex">
								<CloneScenarioButton
									connections={[__id]}
									scenarioFragmentRef={row}
									className="mr-2"
								/>
								<ToggleVisibilityButton
									scenarioFragmentRef={row}
									className="mr-2"
									onCompleted={() =>
										refetch({ first: 20 }, { fetchPolicy: "network-only" })
									}
								/>

								<CheckScenarioPermissions
									scenarioFragmentRef={row}
									requiredPermission={
										"UserInAccountPermission_Scenario_Masterplan"
									}
								>
									<MakeMasterPlanButton
										className="mr-2"
										scenarioFragmentRef={row}
										onCompleted={() =>
											refetch({ first: 20 }, { fetchPolicy: "network-only" })
										}
									/>
								</CheckScenarioPermissions>
								<EditScenarioButton className="mr-2" scenarioFragmentRef={row} />
							</div>
						);
					}}
				/>
			</TkDataTable>

			{hasNext && (
				<div className="flex justify-content-center align-items-center">
					<Button
						type="button"
						className="p-button-secondary"
						disabled={!hasNext}
						onClick={() => loadNext(20)}
					>
						Load more
					</Button>
				</div>
			)}
		</>
	);
};
