import { DivisionsTable } from "../../components/relay/DivisionsTable";
import { SettingsScreenTemplate } from "@components/settings-screen-template/settings-screen-template.component";
import { DivisionFilters } from "@screens/divisions/parts/division-filters.component";

export const DivisionsScreen = () => {
	return (
		<SettingsScreenTemplate
			title={"Divisions"}
			Filters={DivisionFilters}
			Table={DivisionsTable}
		/>
	);
};
