import React, { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TagsSelect } from "@components/tags-select";
import { selectStaffViewFilters, setStaffViewFilters } from "@redux/StaffViewSlice";

export const StaffViewAssignmentTagsFilter = () => {
	const dispatch = useDispatch();
	const filters = useSelector(selectStaffViewFilters);

	return (
		<div className="field mr-2" style={{ minWidth: 150 }}>
			<label htmlFor={"assignment-tags-filter"}>Assignment Tags</label>
			<br />
			<Suspense>
				<TagsSelect
					fieldName="assignment-tags-filter"
					fieldValue={filters.filterByAssignmentTags}
					placeholder={"Filter by assignment tags"}
					updateField={(e) =>
						dispatch(
							setStaffViewFilters({
								...filters,
								filterByAssignmentTags: e?.length ? e : undefined,
							}),
						)
					}
				/>
			</Suspense>
		</div>
	);
};
