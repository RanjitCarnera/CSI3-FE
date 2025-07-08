import { SettingsScreenTemplate } from "@components/settings-screen-template/settings-screen-template.component";
import { AssignmentRolesFiltersComponent } from "@screens/assignment-roles/parts/assignment-roles-filters.component";
import { AssignmentAssignmentRolesTable } from "@screens/assignment-roles/parts/assignment-roles-table";
import { CucTemplatesTable } from "@screens/cuc-templates/parts/table";

export const AssignmentRolesScreen = () => {
	return (
		<SettingsScreenTemplate
			title={"Assignment roles"}
			Filters={AssignmentRolesFiltersComponent}
			Table={() => (
				<>
					<AssignmentAssignmentRolesTable />
					<CucTemplatesTable />
				</>
			)}
		/>
	);
};
