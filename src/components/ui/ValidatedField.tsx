import { Tooltip } from "@thekeytechnology/framework-react-components";
import { type FormikState } from "formik";
import { classNames } from "primereact/utils";
import React, { type ReactNode } from "react";

import styled from "styled-components";
import tw from "twin.macro";

export interface ValidatedFieldProperties {
	required?: boolean;
	disabled?: boolean;
	placeholder?: string;

	step?: number;
	min?: number;
	max?: number;

	mode?: "decimal" | "currency" | undefined;
	locale?: string;
	id?: string;
}

export interface ValidatedFieldConfig<FieldType> extends ValidatedFieldProperties {
	fieldValue: FieldType | undefined;
	updateField: (newValue: FieldType | undefined) => void;
	fieldName?: string;
	required?: boolean;
	isValid?: boolean;
	disabled?: boolean;
	placeholder?: string;
	excludeIds?: string[];
}

export type FormikHookProps<State> = FormikState<State> & {
	setFieldTouched: (
		field: string,
		touched?: boolean,
		shouldValidate?: boolean | undefined,
	) => any;
	setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => any;
};

export interface ValidatedFieldPropsV2<State, FieldType> extends ValidatedFieldProperties {
	label?: string;
	tooltipContent?: string;
	name: keyof State & string;

	formikConfig: FormikHookProps<State>;

	iconClass?: string;
	className?: string;
	helpText?: ReactNode;

	component: (renderConfig: ValidatedFieldConfig<FieldType>) => ReactNode;
	onChange?: (updatedValue: FieldType | undefined) => void;
	readonlyValue?: FieldType;
}

export function ValidatedField<State, FieldType>({
	className,
	iconClass,
	name,
	label,
	tooltipContent,
	formikConfig,
	helpText,
	component,
	required,
	onChange,
	readonlyValue,
	...rest
}: ValidatedFieldPropsV2<State, FieldType>) {
	const hasError = formikConfig.errors[name];

	const value = formikConfig.values[name] as unknown as FieldType;

	const updateValue = (updatedValue: FieldType | undefined) => {
		formikConfig.setFieldTouched(name, true);
		formikConfig.setFieldValue(name, updatedValue);
		onChange?.(updatedValue);
	};

	const FieldContent = (
		<>
			{iconClass && <i className={`pi ${iconClass}`} />}

			{component({
				fieldValue: readonlyValue ?? value,
				isValid: !hasError,
				fieldName: name,
				updateField: updateValue,
				required,
				...rest,
			})}
		</>
	);

	return (
		<div className={`field flex flex-column ${className ?? ""}`}>
			{label ? (
				<LabelAndToolTipWrapper>
					{tooltipContent && (
						<Tooltip target={`#${name}-filter`} content={tooltipContent} />
					)}
					<label htmlFor={name} className={classNames("mr-2", { "p-error": hasError })}>
						{label} {required ? <Required>*</Required> : ""}
					</label>
					{tooltipContent && <i id={`${name}-filter`} className={"pi pi-info-circle"} />}
				</LabelAndToolTipWrapper>
			) : null}

			{iconClass ? <span className="p-input-icon-right">{FieldContent}</span> : FieldContent}

			{hasError ? (
				<small className="p-error">{(formikConfig.errors as any)[name]}</small>
			) : null}

			{helpText ? <small>{helpText}</small> : null}
		</div>
	);
}

const Required = styled.span`
	color: var(--danger);
`;
const LabelAndToolTipWrapper = tw.div`flex gap-1 items-center mb-2`;
