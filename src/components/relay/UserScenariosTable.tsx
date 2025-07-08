import graphql from "babel-plugin-relay/macro";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import { useSelector } from "react-redux";
import { readInlineData, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { CheckScenarioPermissions } from "./CheckScenarioPermissions";
import { CloneScenarioButton } from "./CloneScenarioButton";
import { MakeMasterPlanButton } from "./MakeMasterPlanButton";
import { ToggleVisibilityButton } from "./ToggleVisibilityButton";
import { type UserScenariosTable_Query } from "../../__generated__/UserScenariosTable_Query.graphql";
import { type UserScenariosTable_ScenarioFragment$key } from "../../__generated__/UserScenariosTable_ScenarioFragment.graphql";
import { type UserScenariosTable_ScenariosListFragment$key } from "../../__generated__/UserScenariosTable_ScenariosListFragment.graphql";
import { selectHasPermissions } from "../../redux/CurrentUserSlice";
import { CreateScenarioButton } from "../ui/CreateScenarioButton";
import { TkButton } from "../ui/TkButton";
import { TkDataTable } from "../ui/TkDataTable";
import { TkTag } from "../ui/TkTag";
import { DateTimeDisplay } from "../ui/DateTimeDisplay";
import { ChangeCurrentScenarioButton } from "../ui/ChangeCurrentScenarioButton";

const QUERY = graphql`
	query UserScenariosTable_Query($first: Int, $onlyShowMine: Boolean) {
		...UserScenariosTable_ScenariosListFragment
			@arguments(first: $first, onlyShowMine: $onlyShowMine)
	}
`;

// noinspection GraphQLUnresolvedReference
const SCENARIOS_FRAGMENT = graphql`
	fragment UserScenariosTable_ScenariosListFragment on Query
	@refetchable(queryName: "UserScenariosTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 20 }
		after: { type: "String" }
		onlyShowMine: { type: "Boolean" }
	) {
		Scenario {
			Scenarios(first: $first, after: $after, onlyShowMine: $onlyShowMine)
				@connection(key: "UserScenariosTable_Scenarios") {
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
						...UserScenariosTable_ScenarioFragment
					}
				}
			}
		}
	}
`;

const SCENARIO_FRAGMENT = graphql`
	fragment UserScenariosTable_ScenarioFragment on Scenario @inline {
		id
		name
		isMasterPlan
		lastUpdatedAt
		gapDays {
			gapDays
			gapSalary
		}
		utilization {
			unusedSalary
			averageUtilizationPercentage
		}
		...CheckScenarioPermissions_ScenarioFragment
		...MakeMasterPlanButton_ScenarioFragment
		...CloneScenarioButton_ScenarioFragment
		...ToggleVisibilityButton_ScenarioFragment
	}
`;

interface OwnProps {
	scenarioId: string;
	onlyShowMine?: boolean;
}

export const UserUserScenariosTable = ({ scenarioId, onlyShowMine }: OwnProps) => {
	const hasPermissions = useSelector(selectHasPermissions);
	const gapDaysEnabled = hasPermissions(["AccountPermission_Auth_GapDaysEnabled"]);

	const data = useLazyLoadQuery<UserScenariosTable_Query>(
		QUERY,
		{
			first: 20,
			onlyShowMine,
		},
		{ fetchPolicy: "network-only" },
	);

	const {
		data: {
			Scenario: {
				Scenarios: { __id, edges },
			},
		},
		hasNext,
		loadNext,
		refetch,
	} = usePaginationFragment<
		UserScenariosTable_Query,
		UserScenariosTable_ScenariosListFragment$key
	>(SCENARIOS_FRAGMENT, data);

	const Scenarios = edges?.map((b) => b!.node!);
	const currentScenario = Scenarios?.find((s) => s.id === scenarioId);
	return (
		<div>
			<div className="flex justify-content-end">
				<CreateScenarioButton connectionId={__id} />
			</div>
			<TkDataTable
				selectionMode={"single"}
				dataKey={"id"}
				selection={currentScenario}
				emptyMessage={"No scenarios found"}
				className="mb-3"
				value={Scenarios?.map((s) =>
					readInlineData<UserScenariosTable_ScenarioFragment$key>(SCENARIO_FRAGMENT, s),
				)}
			>
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
				{gapDaysEnabled && (
					<Column
						sortable
						sortField={"gapDays.gapDays"}
						header="Gap days"
						body={(row) => {
							return row.gapDays?.gapDays;
						}}
					/>
				)}
				{gapDaysEnabled && (
					<Column
						sortable
						sortField={"dapDays.gapSalary"}
						header="Gap salary"
						body={(row) => {
							return <>${row.gapDays?.gapSalary?.toFixed(0)}</>;
						}}
					/>
				)}
				<Column
					sortable
					sortField={"utilization.averageUtilizationPercentage"}
					header="Avg. Utilization %"
					body={(row) => {
						return (
							(row.utilization?.averageUtilizationPercentage * 100).toFixed(2) + "%"
						);
					}}
				/>
				<Column
					sortable
					sortField={"utilization.unusedSalary"}
					header="Unutilized salary"
					body={(row) => {
						return <>${row.utilization?.unusedSalary?.toFixed(0)}</>;
					}}
				/>
				<Column
					sortable
					sortField={"lastUpdatedAt"}
					header="Last updated"
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
										refetch(
											{
												first: 20,
												onlyShowMine,
											},
											{ fetchPolicy: "network-only" },
										)
									}
								/>

								<CheckScenarioPermissions
									scenarioFragmentRef={row}
									requiredPermission={
										"UserInAccountPermission_Scenario_Masterplan"
									}
								>
									<MakeMasterPlanButton
										scenarioFragmentRef={row}
										onCompleted={() =>
											refetch(
												{ first: 20, onlyShowMine },
												{ fetchPolicy: "network-only" },
											)
										}
									/>
								</CheckScenarioPermissions>

								{row === currentScenario ? (
									<div className="ml-2">
										<TkTag>Current</TkTag>
									</div>
								) : (
									<ChangeCurrentScenarioButton scenarioId={row.id} />
								)}
							</div>
						);
					}}
				/>
			</TkDataTable>

			{hasNext && (
				<div className="flex justify-content-center align-items-center">
					<TkButton
						type="button"
						className="p-button-secondary"
						onClick={() => loadNext(20)}
					>
						Load more
					</TkButton>
				</div>
			)}
		</div>
	);
};

export const SkeletonUserScenariosTable = () => (
	<TkDataTable<any> value={[1, 2, 3]} className="p-datatable-striped">
		<Column
			header="Company name"
			style={{ width: "25%" }}
			body={<Skeleton></Skeleton>}
		></Column>
		<Column header="Gap days" style={{ width: "25%" }} body={<Skeleton></Skeleton>}></Column>
		<Column header="Actions" style={{ width: "25%" }} body={<Skeleton></Skeleton>}></Column>
	</TkDataTable>
);
