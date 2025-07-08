import { ValidatedField } from "./ValidatedField";
import React, { useImperativeHandle } from "react";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
import { FormikProps } from "formik/dist/types";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Form } from "@thekeytechnology/framework-react-components";

export interface EditScenarioFormState {
	name?: string;
}

interface OwnProps {
	initialState?: EditScenarioFormState;
	onSubmit: (
		values: EditScenarioFormState,
		formikHelpers: FormikHelpers<EditScenarioFormState>,
	) => void;
}

export const EditScenarioForm = React.forwardRef<FormikProps<EditScenarioFormState>, OwnProps>(
	({ initialState, onSubmit }, ref) => {
		const formik = useFormik<EditScenarioFormState>({
			initialValues: initialState || {},
			enableReinitialize: true,
			validationSchema: Yup.object().shape({
				name: Yup.string().required("Name is a required field."),
			}),
			onSubmit: onSubmit,
		});

		useImperativeHandle(ref, () => ({
			...formik,
		}));

		return (
			<Form onSubmit={formik.handleSubmit}>
				<ValidatedField<EditScenarioFormState, string>
					className="mb-4"
					name={"name"}
					label={"Name"}
					required={true}
					formikConfig={formik}
					component={({ fieldValue, updateField, fieldName, isValid }) => {
						return (
							<InputText
								id={fieldName}
								name={fieldName}
								value={fieldValue}
								onChange={(e) => updateField(e.target.value)}
								className={classNames({ "p-invalid": !isValid })}
							/>
						);
					}}
				/>
			</Form>
		);
	},
);
