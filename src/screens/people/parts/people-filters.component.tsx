import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DefaultSettingsFilters } from "@components/settings-filters";
import { useDebouncedState } from "../../../hooks/use-debounced-state.hook";
import {
	clearPeopleFilters,
	selectPeopleFilters,
	setPeopleFilters,
} from "../../../redux/PeopleSlice";

export const PeopleFiltersComponent = () => {
	const filters = useSelector(selectPeopleFilters);
	const dispatch = useDispatch();

	const [name, setName] = useDebouncedState(filters.filterByName, (newValue) => {
		handleOnChange(newValue ?? "");
	});

	const handleOnChange = useCallback(
		(e?: string) => {
			if (e === filters.filterByName) return;
			dispatch(
				setPeopleFilters({
					...filters,
					filterByName: e,
				}),
			);
		},
		[filters],
	);
	const handleOnReset = () => {
		dispatch(clearPeopleFilters());
	};
	return <DefaultSettingsFilters onChange={setName} onReset={handleOnReset} value={name} />;
};
