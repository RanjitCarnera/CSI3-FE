import { ScenariosTable } from "../../components/relay/ScenariosTable";
import { SettingsScreenTemplate } from "@components/settings-screen-template/settings-screen-template.component";
import { ScenarioFilters } from "@screens/scenarios/parts/ScenarioFilters";

export const ScenariosScreen = () => {
	return (
		<SettingsScreenTemplate
			title={"Scenarios"}
			Filters={ScenarioFilters}
			Table={ScenariosTable}
		/>
	);
};
