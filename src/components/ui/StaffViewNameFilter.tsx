import { selectStaffViewFilters, setStaffViewFilters } from "../../redux/StaffViewSlice";
import { InputText } from "primereact/inputtext";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export const StaffViewNameFilter = () => {
	const filters = useSelector(selectStaffViewFilters);

	const dispatch = useDispatch();

	return (
		<InputText
			className="w-12"
			placeholder={"Search by name"}
			value={filters.filterByPersonName}
			onChange={(e) => {
				dispatch(
					setStaffViewFilters({
						...filters,
						filterByPersonName: e.target.value || undefined,
					}),
				);
			}}
		/>
	);
};
