import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TkInputText } from "@components/ui/TkInputText";
import { selectScenarioPeopleFilters, setProjectViewPeopleFilters } from "@redux/ProjectViewSlice";
import { useDebouncedState } from "../../../../../../hooks/use-debounced-state.hook";

export const RosterListNameFilter = () => {
	const filters = useSelector(selectScenarioPeopleFilters);
	const dispatch = useDispatch();
	const [state, setState] = useDebouncedState(
		filters.filterByName,
		(newValue) => {
			dispatch(
				setProjectViewPeopleFilters({
					...filters,
					filterByName: newValue ?? "",
				}),
			);
		},
		500,
	);

	useEffect(() => {
		setState(filters.filterByName);
	}, [filters.filterByName]);

	return (
		<span className="p-input-icon-left w-12">
			<i className="pi pi-search" />
			<TkInputText
				className="w-12"
				placeholder={"Search by Name"}
				value={state}
				onChange={(e) => {
					setState(e.currentTarget.value ?? "");
				}}
			/>
		</span>
	);
};
