import { Tooltip } from "@thekeytechnology/framework-react-components";
import { Calendar } from "primereact/calendar";
import { Editor } from "primereact/editor";
import {
	InputNumber,
	type InputNumberChangeEvent,
	type InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { classNames } from "primereact/utils";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import tw from "twin.macro";
import { TkButton } from "@components/ui/TkButton";
import { TkButtonLink } from "@components/ui/TkButtonLink";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { type ValidatedFieldConfig } from "./ValidatedField";

export const DefaultPhoneNumberField = ({
	fieldValue,
	disabled,
	...config
}: ValidatedFieldConfig<string>) => {
	const hasPermissions = useSelector(selectHasPermissions);
	const hasPrivateDataReadPermission = hasPermissions([
		"UserInAccountPermission_PrivateData_Read",
	]);

	return (
		<DefaultTextFieldComponent
			disabled={!hasPrivateDataReadPermission || disabled}
			fieldValue={hasPrivateDataReadPermission ? fieldValue : "********"}
			{...config}
		/>
	);
};
export function DefaultTextFieldComponent({
	fieldName,
	fieldValue,
	updateField,
	isValid,
	disabled,
	placeholder,
	...config
}: ValidatedFieldConfig<string>) {
	return (
		<InputText
			id={fieldName}
			name={fieldName}
			value={fieldValue}
			onChange={(e) => {
				updateField(e.target.value);
			}}
			disabled={disabled}
			placeholder={placeholder}
			className={classNames({ "p-invalid": !isValid })}
			{...config}
		/>
	);
}

export function DefaultPercentageFieldComponent({
	fieldName,
	fieldValue,
	updateField,
	isValid,
	min,
	max,
	step,
	disabled,
	placeholder,
	mode,
	locale,
	...props
}: ValidatedFieldConfig<number>) {
	const handleOnChange = (e: InputNumberChangeEvent | InputNumberValueChangeEvent) => {
		const updatedValue =
			e.value !== undefined && e.value !== null ? (e.value || 0) / 100 : undefined;
		updateField(updatedValue);
	};
	return (
		<InputNumber
			step={step ?? 1}
			disabled={disabled}
			value={fieldValue ? (fieldValue || 0) * 100 : undefined}
			name={fieldName}
			min={min}
			max={max}
			mode={mode}
			locale={locale}
			minFractionDigits={3}
			maxFractionDigits={3}
			placeholder={placeholder}
			className={classNames({ "p-invalid": !isValid })}
			onChange={handleOnChange}
			onValueChange={handleOnChange}
			{...props}
		/>
	);
}

export function DefaultOTPFieldComponent({
	fieldName,
	fieldValue,
	updateField,
	isValid,
	disabled,
	placeholder,
	mode,
	locale,
	length,
	onComplete,
	...props
}: ValidatedFieldConfig<string> & { length: number; onComplete?: (otp: string) => void }) {
	const inputRef = useRef<HTMLInputElement[]>(Array(length).fill(null));
	const [OTP, setOTP] = useState<string[]>(Array(length).fill(""));

	const handleTextChange = (input: string, index: number) => {
		const newPin = [...OTP];
		newPin[index] = input;
		setOTP(newPin);
		if (input.length === 1 && index < length - 1) {
			inputRef.current[index + 1]?.focus();
		}

		if (input.length === 0 && index > 0) {
			inputRef.current[index - 1]?.focus();
		}

		if (newPin.every((digit) => digit !== "")) {
			onComplete?.(newPin.join(""));
		}
	};

	return (
		<OtpGrid>
			{Array.from({ length }, (_, index) => (
				<InputText
					key={index}
					type="number"
					maxLength={1}
					value={OTP[index]}
					onChange={(e) => {
						handleTextChange(e.target.value, index);
					}}
					ref={(ref) => (inputRef.current[index] = ref as HTMLInputElement)}
					className={`border border-solid border-border-slate-500 focus:border-blue-600  outline-none`}
				/>
			))}
		</OtpGrid>
	);
}

export function DefaultNumberFieldComponent({
	fieldName,
	fieldValue,
	updateField,
	isValid,
	disabled,
	placeholder,
	max,
	min,
	step,
	...config
}: ValidatedFieldConfig<number> & { maxFractionDigits?: number }) {
	return (
		<InputNumber
			step={step}
			min={min}
			max={max}
			disabled={disabled}
			value={fieldValue}
			name={fieldName}
			placeholder={placeholder}
			className={classNames({ "p-invalid": !isValid })}
			onChange={(e) => {
				updateField(e.value ?? undefined);
			}}
			{...config}
		/>
	);
}

export const DefaultSalaryComponent = ({
	fieldValue,
	updateField,
	disabled,
	...config
}: ValidatedFieldConfig<number>) => {
	const hasPermissions = useSelector(selectHasPermissions);

	const hasPermission = hasPermissions(["UserInAccountPermission_Salary_Read"]);

	const withPermissionComponent = (
		<DefaultNumberFieldComponent
			min={0}
			step={1}
			maxFractionDigits={2}
			updateField={updateField}
			disabled={!hasPermission || disabled}
			fieldValue={fieldValue}
			{...config}
		/>
	);
	const proxiedFieldValue: string | undefined = Array.from({
		length: fieldValue?.toString().length ?? 10,
	})
		.fill(0)
		.map(() => "*")
		.join("");
	const handleVoidUpdateField = () => {};
	const noPermissionComponent = React.cloneElement(
		<span id={config.fieldName + "-wrapper"}>
			<DefaultTextFieldComponent
				updateField={handleVoidUpdateField}
				disabled={hasPermission || disabled}
				fieldValue={proxiedFieldValue}
				{...config}
			/>
		</span>,
		{ className: classNames({ "p-invalid": !config.isValid }) },
	);
	const input = hasPermission ? withPermissionComponent : noPermissionComponent;
	const tooltipOpt = !hasPermission ? (
		<Tooltip target={`#${config.fieldName}-wrapper`} content={"Insufficient Permission."} />
	) : (
		<Fragment />
	);
	return (
		<>
			{tooltipOpt}
			{input}
		</>
	);
};

export function DefaultTextAreaComponent({
	fieldName,
	fieldValue,
	updateField,
	isValid,
	disabled,
	placeholder,
	rows,
}: ValidatedFieldConfig<string> & { rows?: number }) {
	return (
		<InputTextarea
			id={fieldName}
			name={fieldName}
			value={fieldValue}
			onChange={(e) => {
				updateField(e.target.value);
			}}
			disabled={disabled}
			placeholder={placeholder}
			className={classNames({ "p-invalid": !isValid })}
			rows={rows}
		/>
	);
}

export function DefaultSwitchComponent({
	fieldName,
	fieldValue,
	updateField,
	isValid,
	disabled,
	tooltip,
}: ValidatedFieldConfig<boolean> & { tooltip?: string }) {
	return (
		<div>
			{fieldName && tooltip && <Tooltip target={`#${fieldName}`} content={tooltip} />}
			<InputSwitch
				id={fieldName}
				name={fieldName}
				checked={fieldValue ?? false}
				onChange={(e) => {
					updateField(e.target.value);
				}}
				disabled={disabled}
				className={classNames({ "p-invalid": !isValid })}
			/>
		</div>
	);
}

export function DefaultCalendarComponent({
	fieldName,
	fieldValue,
	updateField,
	disabled,
	isValid,
	placeholder,
}: ValidatedFieldConfig<string>) {
	const ref = useRef<Calendar>(null);
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			const isEnter = e.code === "Enter";
			if (!isEnter) return;
			ref.current?.hide();
			ref.current?.getInput().blur();
		};
		window.addEventListener("keydown", handler);

		return () => {
			window.removeEventListener("keydown", handler, true);
		};
	}, []);

	const handleOnHide = (e?: any) => {
		ref?.current?.updateViewDate(e as React.SyntheticEvent, new Date());
	};
	return (
		<div>
			<Calendar
				onHide={handleOnHide}
				ref={ref}
				id={fieldName}
				name={fieldName}
				icon="pi pi-calendar"
				iconPos="right"
				showIcon={true}
				placeholder={placeholder}
				value={fieldValue ? new Date(fieldValue + "T00:00:00") : undefined}
				onChange={(e) => {
					e.value
						? updateField((e.value as Date | undefined)?.toISOString().split("T")[0])
						: updateField(undefined);
				}}
				hideOnDateTimeSelect={true}
				disabled={disabled}
				className={classNames({ "p-invalid": !isValid })}
			/>
		</div>
	);
}

export function DefaultEditorComponent({
	fieldName,
	fieldValue,
	updateField,
	isValid,
	disabled,
	placeholder,
}: ValidatedFieldConfig<string>) {
	return (
		<Editor
			style={{ height: "320px" }}
			name={fieldName}
			id={fieldName}
			value={fieldValue}
			onTextChange={(e) => {
				updateField(e.htmlValue ?? undefined);
			}}
			placeholder={placeholder}
			disabled={disabled}
			className={classNames({ "p-invalid": !isValid })}
		/>
	);
}

export function DefaultStringArrayField({
	emptyMessage,
	...fieldConfig
}: ValidatedFieldConfig<string[]> & { emptyMessage?: string }) {
	const entries = fieldConfig.fieldValue || [];

	return (
		<div>
			<div>
				{fieldConfig.fieldValue?.map((entry, index, array) => {
					return (
						<div className="flex align-items-center mb-2" key={"row-" + index}>
							<div className="flex-grow-1">
								<DefaultTextAreaComponent
									placeholder={fieldConfig.placeholder}
									fieldValue={entry}
									isValid={fieldConfig.isValid}
									updateField={(newValue) => {
										const newEntries = [...array];
										newEntries[index] = newValue ?? "";
										fieldConfig.updateField(newEntries);
									}}
								/>
							</div>
							<div>
								<TkButtonLink
									type="button"
									label={"Delete"}
									onClick={() => {
										const newEntries = [...array];
										newEntries.splice(index, 1);
										fieldConfig.updateField(newEntries);
									}}
								/>
							</div>
						</div>
					);
				})}
			</div>
			<div>{!fieldConfig.fieldValue?.length && emptyMessage}</div>
			<TkButton
				type="button"
				label={"New"}
				onClick={() => {
					fieldConfig.updateField([...entries, ""]);
				}}
			/>
		</div>
	);
}

export const OtpGrid = tw.div`grid grid-cols-6 gap-4`;
