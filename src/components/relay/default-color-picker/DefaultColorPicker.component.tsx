import { ColorPicker } from "primereact/colorpicker";
import { classNames } from "primereact/utils";
import { getFieldValue } from "@components/relay/default-color-picker/default-color-picker.utils";
import { type DefaultColorPickerProps } from "./default-color-picker.interface";

export const DefaultColorPickerComponent = ({
	fieldName,
	fieldValue,
	updateField,
	isValid,
	disabled,
	placeholder,
	tooltip,
}: DefaultColorPickerProps) => {
	return (
		<div className={"flex flex-column"}>
			<ColorPicker
				tooltip={tooltip}
				disabled={disabled}
				placeholder={placeholder}
				id={fieldName}
				name={fieldName}
				value={getFieldValue(fieldValue ?? "")}
				onChange={(e) => {
					const newValue = e.value as string;
					const newFieldValue = newValue.length ? `#${newValue}` : newValue;
					updateField(newFieldValue);
				}}
				className={classNames({ "p-invalid": !isValid, "w-2rem h-2rem": true })}
			/>
		</div>
	);
};
