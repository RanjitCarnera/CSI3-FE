import { type PropsWithChildren } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddSelectedProjectsToScenarioButton } from "@components/add-selected-projects-to-scenario-button";
import { ImportFromRandButton } from "@components/import-from-rand-button/import-from-rand-button.component";
import { ProjectFiltersComponent } from "@components/project-filters";
import { CreateProjectButton } from "@components/relay/create-project-button/create-project-button.component";
import { DeleteProjectsButton } from "@components/relay/DeleteProjectsButton";
import { ExportProjectsButton } from "@components/relay/ExportProjectsButton";
import { ImportFromDynamicsButton } from "@components/relay/ImportFromDynamicsButton";
import { ImportProjectsButton } from "@components/relay/ImportProjectsButton";
import { SyncDynamicsProjectsButton } from "@components/relay/sync-dynamics-projects-button";
import { WriteAssignmentToDynamicsButton } from "@components/relay/write-assignments-to-dynamics-button";
import { SyncRandProjectsButton } from "@components/sync-rand-projects-button";
import {
	selectProjectConnectionId,
	selectProjectSelection,
	setSelection,
} from "@redux/ProjectSlice";

export const ProjectsLayout = ({ children }: PropsWithChildren) => {
	const selection = useSelector(selectProjectSelection);
	const connectionId = useSelector(selectProjectConnectionId);
	const dispatch = useDispatch();
	return (
		<div
			style={{
				gap: "0.5rem",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					gap: "0.5rem",
					display: "flex",
					flexDirection: "column",
					position: "sticky",
					top: "-10px",
					padding: "10px 0",
					zIndex: 100,
					backgroundColor: "white",
				}}
			>
				<ProjectFiltersComponent />
				<div className="flex justify-content-end flex-wrap gap-2">
					<AddSelectedProjectsToScenarioButton
						selectedProjectIds={selection.map((s) => s.id)}
					/>

					<ImportProjectsButton />
					<ExportProjectsButton />
					<CreateProjectButton connectionId={connectionId} />
					<DeleteProjectsButton
						projectIds={selection.map((s) => s.id)}
						connectionIds={[connectionId]}
					/>
					<ImportFromDynamicsButton connectionId={connectionId} />
					<ImportFromRandButton connectionId={connectionId} />
					<WriteAssignmentToDynamicsButton projectIds={selection.map((s) => s.id)} />
					<SyncDynamicsProjectsButton projectIds={selection.map((s) => s.id)} />
					<SyncRandProjectsButton
						projectIds={selection.map((s) => s.id)}
						onCompleted={() => {
							dispatch(setSelection([]));
						}}
					/>
				</div>
			</div>

			{children}
		</div>
	);
};
