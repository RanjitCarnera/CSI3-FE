import { InputText } from "primereact/inputtext";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	selectScenarioProjectFilters,
	setProjectViewProjectFilters,
} from "@redux/ProjectViewSlice";
import { useDebouncedState } from "../../../../hooks/use-debounced-state.hook";

export const ProjectViewNameFilter = () => {
	const projectFilters = useSelector(selectScenarioProjectFilters);
	const dispatch = useDispatch();

	const [state, setState] = useDebouncedState(
		projectFilters.filterByName ?? "",
		(newValue) => {
			dispatch(
				setProjectViewProjectFilters({
					...projectFilters,
					filterByName: newValue,
				}),
			);
		},
		200,
	);

	useEffect(() => {
		if (!projectFilters.filterByName) setState("");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projectFilters.filterByName]);

	return (
		<div>
			<span className="p-input-icon-left w-16">
				<i className="pi pi-search" />
				<InputText
					className={"w-20rem"}
					name="name-filter"
					placeholder={"Search by project name or identifier..."}
					value={state}
					onChange={(e) => {
						setState(e.target.value ?? "");
					}}
				/>
			</span>
		</div>
	);
};
