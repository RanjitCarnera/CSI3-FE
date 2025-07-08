import { SettingsScreenTemplate } from "@components/settings-screen-template/settings-screen-template.component";
import { TagsTable } from "@screens/tags/parts/tags-table";
import { TagsTableFilters } from "@screens/tags/parts/tags-table-filters";
import { SettingsTagsContextProvider } from "@screens/tags/tags.context";

export const TagsScreen = () => {
	return (
		<SettingsScreenTemplate
			title={"Tags"}
			Filters={TagsTableFilters}
			Table={TagsTable}
			ContextProvider={SettingsTagsContextProvider}
		/>
	);
};
