import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { TagsSelect } from "@components/tags-select";
import {
	selectScenarioProjectFilters,
	setProjectViewProjectFilters,
} from "@redux/ProjectViewSlice";

export const ProjectViewAssignmentTagsFilter = () => {
	const projectFilters = useSelector(selectScenarioProjectFilters);
	const dispatch = useDispatch();

	return (
		<div className="field mr-2" style={{ minWidth: 250 }}>
			<label htmlFor={"assignment-status"}>Assignment Tags</label>
			<br />
			<TagsSelect
				placeholder="Filter by assignment tags"
				fieldValue={projectFilters.filterByAssignmentTags}
				updateField={(newValue) => {
					dispatch(
						setProjectViewProjectFilters({
							...projectFilters,
							filterByAssignmentTags: newValue ?? [],
						}),
					);
				}}
			/>
		</div>
	);
};
