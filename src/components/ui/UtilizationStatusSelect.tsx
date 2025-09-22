import { MultiSelect } from "primereact/multiselect";
import React from "react";
import { type UtilizationStatus } from "@relay/RosterList_StaffRefetch.graphql";
import { withDebounce } from "@utils/with-debounce";
import { type ValidatedFieldConfig } from "./ValidatedField";

export const UtilizationStatusSelect = (fieldConfig: ValidatedFieldConfig<UtilizationStatus[]>) => {
	return (
		<MultiSelect
			name={fieldConfig.fieldName}
			value={fieldConfig.fieldValue}
			options={
				[
					{ label: "Not allocated", value: "NotAllocated" },
					{ label: "Underallocated", value: "Underallocated" },
					{ label: "Fully allocated", value: "FullyAllocated" },
					{ label: "Overallocated", value: "Overallocated" },
				] as Array<{ label: string; value: UtilizationStatus | null }>
			}
			placeholder={fieldConfig.placeholder}
			onChange={(e) => {
				fieldConfig.updateField(e.value);
			}}
		/>
	);
};

export const DebouncedUtilizationStatusSelect = withDebounce(UtilizationStatusSelect);
