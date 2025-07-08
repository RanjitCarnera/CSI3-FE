import React from "react";
import { SkillAssessmentsFiltersProps } from "./skill-assessments-filters.types";
import { InputText } from "@thekeytechnology/framework-react-components";
import { useDispatch, useSelector } from "react-redux";

import { placeholder } from "@screens/skill-assessments/parts/skill-assessments-filters/skill-assessments-filters.consts";
import {
	clearSkillAssessmentsFilters,
	selectSkillAssessmentsFilters,
	setSkillAssessmentsFilters,
} from "@redux/skill-assessments.slice";
import { TkButton } from "@components/ui/TkButton";

export const SkillAssessmentsFilters = ({ ...props }: SkillAssessmentsFiltersProps) => {
	const filters = useSelector(selectSkillAssessmentsFilters);
	const dispatch = useDispatch();
	const handleOnChange = (e?: string) => {
		dispatch(setSkillAssessmentsFilters({ ...filters, filterByName: e }));
	};
	return (
		<div className="flex w-12 align-items-center">
			<div className="mr-3">
				<strong>Filters</strong>
			</div>
			<InputText
				value={filters.filterByName ?? ""}
				onValueChange={handleOnChange}
				placeholder={placeholder}
				inputSize={"large"}
			/>

			<div className="flex align-items-center">
				<TkButton
					className="ml-2"
					label={"Reset"}
					icon="pi pi-times"
					onClick={() => {
						dispatch(clearSkillAssessmentsFilters());
					}}
				/>
			</div>
		</div>
	);
};
