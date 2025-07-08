import { Dropdown } from "primereact/dropdown";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type StaffViewSort } from "@relay/staffViewPart_Query.graphql";
import { selectHasPermissions } from "../../../redux/CurrentUserSlice";
import { selectStaffViewFilters, setStaffViewFilters } from "../../../redux/StaffViewSlice";

interface OwnProps {
	className?: string;
}

export const StaffViewSortSelect = ({ className }: OwnProps) => {
	const filters = useSelector(selectStaffViewFilters);
	const dispatch = useDispatch();
	const hasPermissions = useSelector(selectHasPermissions);
	const gapDaysEnabled = hasPermissions(["AccountPermission_Auth_GapDaysEnabled"]);

	const options = [
		{ label: "Sort by name", value: "NameAsc" },
		{ label: "Sort by project", value: "ProjectAsc" },
		{ label: "Sort by job title", value: "PositionAsc" },
		{ label: "Sort by availability", value: "AvailabilityAsc" },
	] as Array<{ label: string; value: StaffViewSort | null }>;

	if (gapDaysEnabled) {
		options.push({ label: "Sort by gap days", value: "GapDaysDesc" });
	}

	return (
		<div className={className} style={{ minWidth: 250 }}>
			<Dropdown
				className="w-12"
				name="sorting-filter"
				placeholder={"Sorting options"}
				options={options}
				value={filters?.sort}
				onChange={(e) => {
					dispatch(
						setStaffViewFilters({
							...filters,
							sort: e.value,
						}),
					);
				}}
			/>
		</div>
	);
};
