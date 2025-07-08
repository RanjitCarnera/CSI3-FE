import { Dropdown } from "primereact/dropdown";
import type { ValidatedFieldConfig } from "@components/ui/ValidatedField";
import { type DocumentBuilderFileFormatKind } from "@relay/GenerateReportButton_ExecuteDocumentBuilderMutation.graphql";

export const FileFormatSelect = (
	fieldConfig: ValidatedFieldConfig<DocumentBuilderFileFormatKind>,
) => {
	const options: Array<{ label: string; value: DocumentBuilderFileFormatKind }> = [
		{ label: "Excel", value: "excel" },
		{ label: "Pdf", value: "pdf" },
	];

	return (
		<Dropdown
			defaultValue={options[1].value}
			name={fieldConfig.fieldName}
			value={fieldConfig.fieldValue}
			options={options}
			onChange={(e) => {
				fieldConfig.updateField(e.value);
			}}
			filter={true}
			placeholder={fieldConfig.placeholder}
		/>
	);
};
