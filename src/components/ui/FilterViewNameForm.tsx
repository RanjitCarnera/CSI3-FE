import { useFormik } from "formik";
import * as Yup from "yup";
import { ValidatedField } from "./ValidatedField";
import { DefaultSwitchComponent, DefaultTextFieldComponent } from "./DefaultTextInput";
import { TkButton } from "./TkButton";
import React from "react";
import { Form } from "@thekeytechnology/framework-react-components";

interface FormState {
	name: string;
	isDefault: boolean;
}

interface OwnProps {
	onSubmit: (input: { name: string; isDefault: boolean }, callback: () => void) => void;
	initialWillBeDefault?: boolean;
}

export const FilterViewNameForm = ({ onSubmit, initialWillBeDefault }: OwnProps) => {
	const formik = useFormik<FormState>({
		initialValues: {
			name: "",
			isDefault: initialWillBeDefault || false,
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			name: Yup.string().required("Name is a required field."),
			willBeDefault: Yup.boolean(),
		}),
		onSubmit: (input, { setSubmitting, resetForm }) => {
			onSubmit(input, () => {
				setSubmitting(false);
				resetForm({});
			});
		},
	});

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<FormState, string>
				className="mb-4"
				name={"name"}
				label={"Choose view name"}
				required={true}
				formikConfig={formik}
				component={DefaultTextFieldComponent}
			/>

			<ValidatedField<FormState, boolean>
				className={""}
				name={"isDefault"}
				label={"Default View?"}
				formikConfig={formik}
				component={DefaultSwitchComponent}
			/>

			<TkButton
				disabled={formik.isSubmitting}
				type="submit"
				label="Save filter view"
				className="p-mt-2"
			/>
		</Form>
	);
};
