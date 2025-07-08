import { TabPanel, type TabPanelHeaderTemplateOptions } from "primereact/tabview";
import { useDispatch, useSelector } from "react-redux";
import { readInlineData, useFragment } from "react-relay";
import styled from "styled-components";
import { TkTabView } from "@components/ui/TkTabView";
import {
	type projectStagesTab_ProjectStageInlineFragment$data,
	type projectStagesTab_ProjectStageInlineFragment$key,
} from "@relay/projectStagesTab_ProjectStageInlineFragment.graphql";
import { type projectStagesTabs_ProjectStages$key } from "@relay/projectStagesTabs_ProjectStages.graphql";
import { type ProjectStagesTabProps } from "@screens/project-view/parts/project-stages-tab/project-stages-tab.types";
import { PROJECT_STAGE_INLINE_FRAGMENT, QUERY_FRAGMENT } from "./project-stages-tab.graphql";
import {
	selectScenarioProjectFilters,
	setPage,
	setProjectViewProjectFilters,
} from "../../../../redux/ProjectViewSlice";

export const ProjectStagesTabs = ({ projectStagesFragmentRef }: ProjectStagesTabProps) => {
	const queryFragment = useFragment<projectStagesTabs_ProjectStages$key>(
		QUERY_FRAGMENT,
		projectStagesFragmentRef,
	);

	const stages =
		queryFragment.Project.ProjectStages.edges?.map((e) =>
			readInlineData<projectStagesTab_ProjectStageInlineFragment$key>(
				PROJECT_STAGE_INLINE_FRAGMENT,
				e?.node!,
			),
		) ?? [];

	const projectFilters = useSelector(selectScenarioProjectFilters);

	const dispatch = useDispatch();

	const createHeaderTemplate =
		(stage: projectStagesTab_ProjectStageInlineFragment$data) =>
		(options: TabPanelHeaderTemplateOptions) => {
			const isActive = projectFilters.filterByStage?.includes(stage.id);
			return (
				<a
					role="tab"
					className="p-tabview-nav-link"
					style={
						isActive
							? {
									color: "var(--primary-color) !important",
									background: "#ffffff",
									borderColor: "#2196F3",
							  }
							: {}
					}
					tabIndex={0}
					onClick={() => {
						dispatch(
							setProjectViewProjectFilters({
								...projectFilters,
								filterByStage: [stage.id],
							}),
						);
					}}
				>
					<span className="p-tabview-title" data-pc-section="headertitle">
						{stage.name}
					</span>
				</a>
			);
		};

	return (
		<ProjectListTabView
			className="mr-2 overflow-x-auto flex-1"
			activeIndex={
				!projectFilters.filterByStage || projectFilters.filterByStage?.length === 0
					? 0
					: 9999
			}
			onTabChange={(e) => {
				dispatch(
					setProjectViewProjectFilters({
						...projectFilters,
						filterByStage: e.index === 0 ? undefined : [stages[e.index - 1]?.id],
					}),
				);
				dispatch(setPage(0));
			}}
		>
			<TabPanel header="All projects"></TabPanel>

			{stages.map((stage) => {
				return (
					<TabPanel key={stage.id} headerTemplate={createHeaderTemplate(stage)}>
						test
					</TabPanel>
				);
			})}
		</ProjectListTabView>
	);
};

const ProjectListTabView = styled(TkTabView)`
	max-width: 40vw;
	@media screen and (min-width: 1920px) {
		max-width: 60vw;
	}
	.p-tabview-nav {
		background-color: transparent;
	}

	.p-unselectable-text:not(.p-tabview-selected) a {
		background-color: transparent;
	}

	.p-tabview-panels {
		background-color: transparent;
		display: none;
	}
`;
