import React from "react";
import { SkillAssessmentsFiltersProps } from "@screens/skill-assessments/parts/skill-assessments-filters/skill-assessments-filters.types";
import { useDispatch, useSelector } from "react-redux";
import { InputText } from "@thekeytechnology/framework-react-components";
import { placeholder } from "@screens/skill-assessments/parts/skill-assessments-filters/skill-assessments-filters.consts";
import {
	clearSkillAssessmentTemplatesFilters,
	selectSkillAssessmentTemplatesFilters,
	setSkillAssessmentTemplatesFilters,
} from "@redux/skill-assessment-templates-slice";
import { TkButton } from "@components/ui/TkButton";

export const SkillAssessmentTemplatesFilters = ({ ...props }: SkillAssessmentsFiltersProps) => {
	const filters = useSelector(selectSkillAssessmentTemplatesFilters);
	const dispatch = useDispatch();
	const handleOnChange = (e?: string) => {
		dispatch(setSkillAssessmentTemplatesFilters({ ...filters, filterByName: e }));
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
						dispatch(clearSkillAssessmentTemplatesFilters());
					}}
				/>
			</div>
		</div>
	);
};
