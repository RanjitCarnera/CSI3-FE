import { ProjectStagesTable } from "../../components/relay/ProjectStagesTable";
import { SettingsScreenTemplate } from "@components/settings-screen-template/settings-screen-template.component";
import { ProjectStageFilters } from "@screens/project-stages/parts/project-stage-filters.component";

export const ProjectStagesScreen = () => {
	return (
		<SettingsScreenTemplate
			title={"Project Stages"}
			Filters={ProjectStageFilters}
			Table={ProjectStagesTable}
		/>
	);
};
