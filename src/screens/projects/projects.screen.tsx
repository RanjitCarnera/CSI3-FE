import { ProjectsTable } from "../../components/relay/ProjectsTable";
import { SettingsScreenTemplate } from "@components/settings-screen-template/settings-screen-template.component";
import { ProjectFiltersComponent } from "@components/project-filters";

export const ProjectsScreen = () => {
	return (
		<SettingsScreenTemplate
			title={"Projects"}
			Filters={ProjectFiltersComponent}
			Table={ProjectsTable}
		/>
	);
};
