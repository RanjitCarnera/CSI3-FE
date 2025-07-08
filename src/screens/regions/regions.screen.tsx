import { RegionsTable } from "../../components/relay/RegionsTable";
import { SettingsScreenTemplate } from "@components/settings-screen-template/settings-screen-template.component";
import { RegionFiltersComponent } from "@screens/regions/parts/region-filters.component";

export const RegionsScreen = () => {
	return (
		<SettingsScreenTemplate
			title={"Region"}
			Filters={RegionFiltersComponent}
			Table={RegionsTable}
		/>
	);
};
