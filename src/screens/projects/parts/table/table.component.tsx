import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { useCallback } from "react";
import styled from "styled-components";
import { FromRandIcon } from "@components/from-rand-icon";
import { ChangeProjectActivationButton } from "@components/relay/ChangeProjectActivationButton";
import { EditProjectButton } from "@components/relay/edit-project-button";
import { GoogleMapsClickout } from "@components/relay/GoogleMapsClickout";
import { SyncProjectFromDynamicsButton } from "@components/relay/sync-project-from-dynamics-button";
import { SyncProjectFromRandButton } from "@components/sync-project-from-rand-button";
import { DateDisplay } from "@components/ui/DateTimeDisplay";
import { FromDynamicsIcon } from "@components/ui/FromDynamicsIcon";
import { TkDataTable } from "@components/ui/TkDataTable";
import type { ProjectsTable_ProjectFragment$data } from "@relay/ProjectsTable_ProjectFragment.graphql";
import { withoutEventPropagation } from "@utils/table.utils";

export const Table = ({
	projectsData,
	selection,
	setSelection,
	hasNext,
	loadNext,
}: {
	projectsData: ProjectsTable_ProjectFragment$data[];
	selection: Array<{ id: string }>;
	setSelection: (selection: Array<{ id: string }>) => void;
	hasNext: boolean;
	loadNext: (num: number) => void;
}) => {
	const handleNameColumn = useCallback(
		(row: ProjectsTable_ProjectFragment$data) => {
			const addressIncomplete =
				row.address && (row.address?.latitude === undefined || row.address.latitude === 0);
			return (
				<div className="flex align-items-center gap-2">
					{row.avatar?.url && <ProjectImage src={row.avatar?.url} />}

					{row.name}

					<GoogleMapsClickout addressFragmentRef={row.address} />

					{row.source === "fromDynamics" && <FromDynamicsIcon />}
					{row.source === "fromRand" && <FromRandIcon tooltip={"From rand"} />}

					{addressIncomplete && (
						<div className="warning flex align-items-center">
							<i className="pi pi-exclamation-triangle mr-2 "></i>
							<div>Incomplete address</div>
						</div>
					)}
					{row.isDeactivated && <Tag value={"Deactivated"} />}
				</div>
			);
		},
		[projectsData],
	);

	return (
		<>
			<TkDataTable
				emptyMessage={
					<div className="flex justify-content-center align-items-center">
						<div className="mr-2">There are not projects yet.</div>
					</div>
				}
				className="mb-3"
				value={projectsData}
				selectionMode="checkbox"
				onSelectionChange={(e) => {
					// @ts-expect-error
					setSelection(e.value);
				}}
				selection={selection}
			>
				<Column selectionMode="multiple" headerStyle={{ width: "3em" }}></Column>

				<Column header="Name" sortField={"name"} sortable body={handleNameColumn} />
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
						onClick={() => {
							loadNext(20);
						}}
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
