import moment from "moment";
import { Dropdown } from "primereact/dropdown";
import { formatDate } from "@components/cuc-field/cuc-field.utils";
import { type FormProjectMilestoneSelectProps } from "@components/form/form-project-milestone-select/form-project-milestone-select.types";

export const FormProjectMilestoneSelect = (fieldConfig: FormProjectMilestoneSelectProps) => {
	return (
		<Dropdown
			className="dropdownWithTooltip"
			name={fieldConfig.fieldName}
			value={fieldConfig.fieldValue}
			disabled={fieldConfig.disabled}
			emptyMessage={"No milestones available"}
			options={fieldConfig.options.filter((e) =>
				fieldConfig.excludeIds ? !fieldConfig.excludeIds.includes(e.value) : true,
			)}
			onChange={(e) => {
				fieldConfig.updateField(e.value);
			}}
			itemTemplate={(option) => {
				return (
					<div>
						{option.label}
						{option?.date ? " - " + formatDate(moment(option.date)) : ""}
					</div>
				);
			}}
			onFocus={(e) => {}}
			filter={true}
			placeholder={fieldConfig.placeholder}
			filterBy={"label"}
		/>
	);
};
