import { SettingsScreenTemplate } from "@components/settings-screen-template/settings-screen-template.component";
import { PeopleFiltersComponent } from "./parts/people-filters.component";
import { PeopleTable } from "../../components/relay/PeopleTable";

export const PeopleScreen = () => {
	return (
		<SettingsScreenTemplate
			title={"Resources"}
			Filters={PeopleFiltersComponent}
			Table={PeopleTable}
		/>
	);
};
