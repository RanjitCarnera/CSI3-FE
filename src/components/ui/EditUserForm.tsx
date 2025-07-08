import { ValidatedField } from "./ValidatedField";
import React, { useImperativeHandle } from "react";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
import { FormikProps } from "formik/dist/types";
import { DefaultSwitchComponent, DefaultTextFieldComponent } from "./DefaultTextInput";
import { Message } from "primereact/message";
import { Form } from "@thekeytechnology/framework-react-components";

export interface EditUserFormState {
	name?: string;
	email?: string;
	activated?: boolean;
}

interface OwnProps {
	initialState?: EditUserFormState;
	onSubmit: (values: EditUserFormState, formikHelpers: FormikHelpers<EditUserFormState>) => void;
}

export const EditUserForm = React.forwardRef<FormikProps<EditUserFormState>, OwnProps>(
	({ initialState, onSubmit }, ref) => {
		const formik = useFormik<EditUserFormState>({
			initialValues: initialState || {},
			enableReinitialize: true,
			validationSchema: Yup.object().shape({
				name: Yup.string().required("Name is a required field."),
				email: Yup.string().email().required("Address is a required field."),
			}),
			onSubmit: onSubmit,
		});

		useImperativeHandle(ref, () => ({
			...formik,
		}));

		return (
			<Form onSubmit={formik.handleSubmit}>
				<Message
					severity={"error"}
					className="mb-5"
					content={"This is a very dangerous feature, please be careful."}
				/>
				<ValidatedField<EditUserFormState, string>
					className="mb-4"
					name={"name"}
					label={"Name"}
					required={true}
					formikConfig={formik}
					component={DefaultTextFieldComponent}
				/>
				<ValidatedField<EditUserFormState, string>
					className="mb-4"
					name={"email"}
					label={"E-Mail"}
					required={true}
					formikConfig={formik}
					component={DefaultTextFieldComponent}
				/>
				<ValidatedField<EditUserFormState, boolean>
					className="mb-4"
					name={"activated"}
					label={"Activated"}
					required={true}
					formikConfig={formik}
					component={DefaultSwitchComponent}
				/>
			</Form>
		);
	},
);
