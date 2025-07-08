import { Button } from "@thekeytechnology/framework-react-components";
import { graphql } from "babel-plugin-relay/macro";
import { OverlayPanel } from "primereact/overlaypanel";
import { Panel } from "primereact/panel";
import { classNames } from "primereact/utils";
import React, { Suspense, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useFragment } from "react-relay";
import { LoadPursuitProjectsFromRandDwhButton } from "@components/load-pursuit-projects-from-rand-dwh-button";
import { SyncWithRandPreconDwhButton } from "@components/sync-with-rand-precon-dwh-button";
import { UpdateAssignmentsFromDynamicsButton } from "@components/update-assignments-from-dynamics-button";
import { ProjectStagesTabs } from "@screens/project-view/parts/project-stages-tab";
import { ProjectViewFiltersPart } from "@screens/project-view/parts/project-view-filters-part";
import { ExportAssignmentsButton } from "@screens/project-view/parts/projects-grid-part/parts/export-assignments-button";
import { GroupByTagsButton } from "@screens/project-view/parts/projects-grid-part/parts/group-by-tags-button";
import { ProjectsGridContent } from "@screens/project-view/parts/projects-grid-part/parts/projects-grid-part-content/projects-grid-part-content.component";
import { ProjectsGridContentFallback } from "@screens/project-view/parts/projects-grid-part/parts/projects-grid-part-content-fallback";
import { type ProjectsGridPart_QueryFragment$key } from "../../../../__generated__/ProjectsGridPart_QueryFragment.graphql";
import { type ProjectsGridPart_ScenarioFragment$key } from "../../../../__generated__/ProjectsGridPart_ScenarioFragment.graphql";
import { ImportAssignmentsButton } from "../../../../components/relay/ImportAssignmentsButton";
import { ExpandProjectsButton } from "../../../../components/ui/ExpandProjectsButton";
import { FilterViewSelector } from "../../../../components/ui/FilterViewSelector";
import { TkButton } from "../../../../components/ui/TkButton";
import { selectPage } from "../../../../redux/ProjectViewSlice";

const QUERY_FRAGMENT = graphql`
	fragment ProjectsGridPart_QueryFragment on Query {
		...projectStagesTabs_ProjectStages
		...FilterViewSelector_QueryFragment @arguments(filterByViewType: ProjectView)
		...projectViewFiltersPart_QueryFragment
		Viewer {
			Auth {
				currentAccount {
					...updateAssignmentsFromDynamicsButton_AccountFragment
				}
			}
		}
	}
`;

const FRAGMENT = graphql`
	fragment ProjectsGridPart_ScenarioFragment on Scenario
	@argumentDefinitions(
		projectFilters: { type: "ProjectWithAssignmentsFiltersInput" }
		personOnAssignmentFilters: { type: "PersonOnAssignmentFiltersInput" }
	) {
		id
		...projectsGridPartContent_ScenarioFragment
			@arguments(
				projectFilters: $projectFilters
				personOnAssignmentFilters: $personOnAssignmentFilters
			)
		...updateAssignmentsFromDynamicsButton_ScenarioFragment
		...projectViewFiltersPart_ScenarioFragment
		...syncWithRandPreconDwhButton_ScenarioFragment
		...loadPursuitProjectsFromRandDwhButton_ScenarioFragment
	}
`;

const PAGE_SIZE = 50;
const ASSIGNMENT_TRESHOLD = 200;

interface OwnProps {
	className?: string;
	scenarioFragmentRef: ProjectsGridPart_ScenarioFragment$key;
	queryFragmentRef: ProjectsGridPart_QueryFragment$key;
}

export const ProjectsGridPart = ({
	className,
	scenarioFragmentRef,
	queryFragmentRef,
}: OwnProps) => {
	const query = useFragment<ProjectsGridPart_QueryFragment$key>(QUERY_FRAGMENT, queryFragmentRef);

	const scenario = useFragment<ProjectsGridPart_ScenarioFragment$key>(
		FRAGMENT,
		scenarioFragmentRef,
	);
	const page = useSelector(selectPage);
	const gridRef = useRef<HTMLDivElement>();
	const ref = useRef<OverlayPanel>(null);

	useEffect(() => {
		gridRef.current?.scrollTo(0, 0);
	}, [page]);

	return (
		<div className={classNames("flex flex-column", className)}>
			<div className="flex w-12 align-items-center hide-print">
				<ProjectStagesTabs projectStagesFragmentRef={query} />

				<div className={"ml-auto mr-2"}>
					<UpdateAssignmentsFromDynamicsButton scenarioFragmentRef={scenario} />
					<SyncWithRandPreconDwhButton scenarioFragmentRef={scenario} />
					<LoadPursuitProjectsFromRandDwhButton scenarioFragmentRef={scenario} />
				</div>
				<div className={"mr-2"}>
					<Button
						content={{ label: "Views", icon: "pi pi-search", iconPosition: "left" }}
						onClick={(e: any) => ref.current?.toggle(e)}
					/>
					<OverlayPanel ref={ref} showCloseIcon>
						<Panel header={"Save / Load Views"}>
							<p className="m-0">
								<FilterViewSelector
									queryFragmentRef={query}
									viewType={"ProjectView"}
								/>
							</p>
						</Panel>
					</OverlayPanel>
				</div>

				<TkButton
					icon="pi pi-print"
					className="mr-2"
					label="Print"
					onClick={() => {
						setTimeout(() => {
							window.print();
						}, 1000);
					}}
				/>
				<ImportAssignmentsButton className="mr-2" />
				<ExportAssignmentsButton scenarioId={scenario.id} />
				<ExpandProjectsButton />
				<GroupByTagsButton />
			</div>

			<ProjectViewFiltersPart
				className={"mt-2 mb-2"}
				queryRef={query}
				scenarioFragment={scenario}
			/>

			<Suspense fallback={<ProjectsGridContentFallback />}>
				<ProjectsGridContent scenarioFragmentRef={scenario} />
			</Suspense>
		</div>
	);
};
