import graphql from "babel-plugin-relay/macro";
import debounce from "lodash.debounce";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { readInlineData, useLazyLoadQuery, usePaginationFragment } from "react-relay";
import styled from "styled-components";
import { AddSelectedProjectsToScenarioButton } from "@components/add-selected-projects-to-scenario-button";
import { FromRandIcon } from "@components/from-rand-icon";
import { ImportFromRandButton } from "@components/import-from-rand-button/import-from-rand-button.component";
import { SyncDynamicsProjectsButton } from "@components/relay/sync-dynamics-projects-button/sync-dynamics-projects-button.component";
import { SyncProjectFromRandButton } from "@components/sync-project-from-rand-button/sync-project-from-rand-button.component";
import { SyncRandProjectsButton } from "@components/sync-rand-projects-button";
import { withoutEventPropagation } from "@utils/table.utils";
import { ChangeProjectActivationButton } from "./ChangeProjectActivationButton";
import { CreateProjectButton } from "./create-project-button/create-project-button.component";
import { DeleteProjectsButton } from "./DeleteProjectsButton";
import { EditProjectButton } from "./edit-project-button";
import { ExportProjectsButton } from "./ExportProjectsButton";
import { GoogleMapsClickout } from "./GoogleMapsClickout";
import { ImportFromDynamicsButton } from "./ImportFromDynamicsButton";
import { ImportProjectsButton } from "./ImportProjectsButton";
import { SyncProjectFromDynamicsButton } from "./sync-project-from-dynamics-button";
import { WriteAssignmentToDynamicsButton } from "./write-assignments-to-dynamics-button/write-assignments-to-dynamics-button.component";
import { type ProjectsTable_ProjectFragment$key } from "../../__generated__/ProjectsTable_ProjectFragment.graphql";
import { type ProjectsTable_ProjectsListFragment$key } from "../../__generated__/ProjectsTable_ProjectsListFragment.graphql";
import { type ProjectsTable_Query } from "../../__generated__/ProjectsTable_Query.graphql";
import { type ProjectsTable_Refetch } from "../../__generated__/ProjectsTable_Refetch.graphql";
import { type ProjectFilters, selectProjectFilters } from "../../redux/ProjectSlice";
import { DateDisplay } from "../ui/DateTimeDisplay";
import { FromDynamicsIcon } from "../ui/FromDynamicsIcon";

import { TkDataTable } from "../ui/TkDataTable";

const QUERY = graphql`
	query ProjectsTable_Query(
		$first: Int
		$filterByName: String
		$filterByRegions: [ID!]
		$filterByDivisions: [ID!]
		$filterByStages: [ID!]
	) {
		...ProjectsTable_ProjectsListFragment
			@arguments(
				first: $first
				filterByName: $filterByName
				filterByRegions: $filterByRegions
				filterByDivisions: $filterByDivisions
				filterByStages: $filterByStages
			)
	}
`;

const PROJECTS_FRAGMENT = graphql`
	fragment ProjectsTable_ProjectsListFragment on Query
	@refetchable(queryName: "ProjectsTable_Refetch")
	@argumentDefinitions(
		first: { type: "Int", defaultValue: 200 }
		after: { type: "String" }
		filterByName: { type: "String" }
		filterByRegions: { type: "[ID!]" }
		filterByDivisions: { type: "[ID!]" }
		filterByStages: { type: "[ID!]" }
	) {
		Project {
			Projects(
				first: $first
				after: $after
				filterByName: $filterByName
				filterByRegions: $filterByRegions
				filterByDivisions: $filterByDivisions
				filterByStages: $filterByStages
				showDeactivated: true
			) @connection(key: "ProjectsTable_Projects") {
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
						...ProjectsTable_ProjectFragment
					}
				}
			}
		}
	}
`;

const PROJECT_FRAGMENT = graphql`
	fragment ProjectsTable_ProjectFragment on Project @inline {
		id
		name
		isDeactivated
		source

		division {
			id
			name
		}
		region {
			id
			name
		}
		startDate
		endDate

		stage {
			id
			name
		}

		address {
			latitude
			longitude
			...GoogleMapsClickout_AddressFragment
		}

		avatar {
			id
			url
		}

		...editProjectButton_ProjectFragment
		...ChangeProjectActivationButton_ProjectFragment
		...syncProjectFromDynamicsButton_ProjectFragment
		...syncProjectFromRandButton_ProjectFragment
	}
`;

export const ProjectsTable = () => {
	const filters = useSelector(selectProjectFilters);

	const [initialLoad, setInitialLoadComplete] = useState(true);
	const data = useLazyLoadQuery<ProjectsTable_Query>(QUERY, { first: 200, ...filters });
	const {
		data: {
			Project: {
				Projects: { __id, edges: projects },
			},
		},
		hasNext,
		refetch,
		loadNext,
	} = usePaginationFragment<ProjectsTable_Refetch, ProjectsTable_ProjectsListFragment$key>(
		PROJECTS_FRAGMENT,
		data,
	);

	const debouncedRefetch = (filters: ProjectFilters) => {
		refetch({ ...filters, first: 200 }, { fetchPolicy: "store-and-network" });
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
			setSelection([]);
			debouncedEventHandler(filters);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters]);

	const [selection, setSelection] = useState<Array<{ id: string }>>([]);
	useEffect(() => {
		setSelection([]);
	}, [projects]);
	return (
		<>
			<div className="flex justify-content-end flex-wrap gap-2">
				<AddSelectedProjectsToScenarioButton
					selectedProjectIds={selection.map((s) => s.id)}
				/>

				<ImportProjectsButton />
				<ExportProjectsButton />
				<CreateProjectButton connectionId={__id} />
				<DeleteProjectsButton
					projectIds={selection.map((s) => s.id)}
					connectionIds={[__id]}
				/>
				<ImportFromDynamicsButton connectionId={__id} />
				<ImportFromRandButton connectionId={__id} />
				<WriteAssignmentToDynamicsButton projectIds={selection.map((s) => s.id)} />
				<SyncDynamicsProjectsButton projectIds={selection.map((s) => s.id)} />
				<SyncRandProjectsButton
					projectIds={selection.map((s) => s.id)}
					onCompleted={() => {
						setSelection([]);
					}}
				/>
			</div>
			<TkDataTable
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">There are not projects yet.</div>
					</div>
				}
				className="mb-3"
				value={[
					...(projects?.map((b) =>
						readInlineData<ProjectsTable_ProjectFragment$key>(
							PROJECT_FRAGMENT,
							b!.node!,
						),
					) as any[]),
				]}
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
					sortField={"name"}
					sortable
					body={(row) => {
						const addressIncomplete =
							row.address &&
							(row.address?.latitude === undefined || row.address.latitude === 0);
						return (
							<div className="flex align-items-center gap-2">
								{row.avatar?.url && <ProjectImage src={row.avatar?.url} />}

								{row.name}

								<GoogleMapsClickout addressFragmentRef={row.address} />

								{row.source === "fromDynamics" && <FromDynamicsIcon />}
								{row.source === "fromRand" && (
									<FromRandIcon tooltip={"From rand"} />
								)}

								{addressIncomplete && (
									<div className="warning flex align-items-center">
										<i className="pi pi-exclamation-triangle mr-2 "></i>
										<div>Incomplete address</div>
									</div>
								)}
								{row.isDeactivated && <Tag value={"Deactivated"} />}
							</div>
						);
					}}
				/>
				<Column
					header="Stage"
					sortField={"stage.name"}
					sortable
					body={(row) => {
						return row.stage?.name;
					}}
				/>
				<Column
					header="Division"
					sortable
					sortField={"division.name"}
					body={(row) => {
						return row.division?.name;
					}}
				/>
				<Column
					header="Region"
					sortable
					sortField={"region.name"}
					body={(row) => {
						return row.region?.name;
					}}
				/>
				<Column
					header="Start Date"
					sortField={"startDate"}
					sortable
					body={(row) => {
						return <DateDisplay value={row.startDate} />;
					}}
				/>
				<Column
					header="End Date"
					sortable
					sortField={"endDate"}
					body={(row) => {
						return <DateDisplay value={row.endDate} />;
					}}
				/>

				<Column
					header="Actions"
					body={(row) => {
						return withoutEventPropagation(
							<div>
								<ChangeProjectActivationButton
									className="mr-2"
									projectFragmentRef={row}
								/>
								{row.source === "fromDynamics" && (
									<SyncProjectFromDynamicsButton
										projectFragmentRef={row}
										className="mr-2"
										projectId={row.id}
									/>
								)}
								{row.source === "fromRand" && (
									<SyncProjectFromRandButton
										projectFragmentRef={row}
										className={"mr-2"}
										projectId={row.id}
									/>
								)}
								<EditProjectButton className="mr-2" projectFragmentRef={row} />
							</div>,
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

const ProjectImage = styled.img`
	height: 40px;
	width: 40px;
`;
