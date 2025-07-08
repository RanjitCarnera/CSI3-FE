import { useContext } from "react";
import { DefaultSettingsFilters } from "@components/settings-filters";
import { SettingsTagsContext } from "@screens/tags/tags.context";

export const TagsTableFilters = () => {
	const { name, setName } = useContext(SettingsTagsContext);

	const handleOnChange = (e?: string) => {
		setName(e ?? "");
	};
	const handleOnReset = () => {
		setName("");
	};
	return (
		<DefaultSettingsFilters onChange={handleOnChange} onReset={handleOnReset} value={name} />
	);
};
