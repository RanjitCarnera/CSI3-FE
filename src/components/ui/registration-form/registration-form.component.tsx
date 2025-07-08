import { useFormik } from "formik";
import * as Yup from "yup";
import { FormikHookProps, ValidatedField } from "../ValidatedField";
import { DefaultTextFieldComponent } from "../DefaultTextInput";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import React, { ReactNode, useImperativeHandle } from "react";
import { FormikProps } from "formik/dist/types";
import { NAME_VALIDATION_SCHEMA } from "./registration-form.const";
import { RegistrationFormState } from "./registration-form.interface";
import { Form } from "@thekeytechnology/framework-react-components";

interface OwnProps {
	hideAccountName: boolean;
	onSuccess: (formState: RegistrationFormState, onSuccess?: () => void) => void;
	buttonLabel?: string;

	additionalFields?: (props: FormikHookProps<RegistrationFormState>) => ReactNode;
}

export const RegistrationForm = React.forwardRef<FormikProps<RegistrationFormState>, OwnProps>(
	({ hideAccountName, onSuccess, buttonLabel, additionalFields }: OwnProps, ref) => {
		const formik = useFormik<RegistrationFormState>({
			initialValues: {
				name: "",
				accountName: "",
				email: "",
				email2: "",
				password: "",
				password2: "",
			},
			enableReinitialize: true,
			validationSchema: Yup.object().shape({
				name: NAME_VALIDATION_SCHEMA,
				email: Yup.string()
					.email("Please enter a valid e-mail address.")
					.required("E-Mail is a required field."),

				email2: Yup.string()
					.email("Please enter a valid e-mail address.")
					.oneOf([Yup.ref("email"), undefined], "E-Mails have to match."),

				password: Yup.string()
					.min(8, "A password needs at least 8 characters.")
					.required("Password is a required field."),
				password2: Yup.string().oneOf(
					[Yup.ref("password"), undefined],
					"Passwords have to match.",
				),
			}),
			onSubmit: (data, { setSubmitting }) => {
				onSuccess(data, () => {
					setSubmitting(false);
				});
			},
		});

		useImperativeHandle(ref, () => ({
			...formik,
		}));

		return (
			<Form onSubmit={formik.handleSubmit}>
				<ValidatedField<RegistrationFormState, string>
					className="mb-4"
					name={"name"}
					label={"Your Name"}
					required={true}
					formikConfig={formik}
					component={DefaultTextFieldComponent}
				/>
				{!hideAccountName && (
					<ValidatedField<RegistrationFormState, string>
						className="mb-4"
						name={"accountName"}
						label={"Company Name"}
						required={true}
						formikConfig={formik}
						component={DefaultTextFieldComponent}
					/>
				)}
				<ValidatedField<RegistrationFormState, string>
					className="mb-4"
					name={"email"}
					label={"Choose your E-Mail"}
					required={true}
					formikConfig={formik}
					component={DefaultTextFieldComponent}
				/>

				<ValidatedField<RegistrationFormState, string>
					className="mb-4"
					name={"email2"}
					label={"Repeat your E-Mail"}
					required={true}
					formikConfig={formik}
					component={DefaultTextFieldComponent}
				/>

				<ValidatedField<RegistrationFormState, string>
					className="mb-4"
					name={"password"}
					label={"Choose a password (min 8 characters)"}
					required={true}
					formikConfig={formik}
					component={({ fieldValue, updateField, fieldName, isValid }) => {
						return (
							<Password
								id={fieldName}
								name={fieldName}
								value={fieldValue}
								onChange={(e) => updateField(e.target.value)}
								toggleMask
								feedback={false}
								className={classNames({ "p-invalid": !isValid })}
							/>
						);
					}}
				/>

				<ValidatedField<RegistrationFormState, string>
					className="mb-6"
					name={"password2"}
					label={"Repeat your password"}
					required={true}
					formikConfig={formik}
					component={({ fieldValue, updateField, fieldName, isValid }) => {
						return (
							<Password
								id={fieldName}
								name={fieldName}
								value={fieldValue}
								onChange={(e) => updateField(e.target.value)}
								toggleMask
								feedback={false}
								className={classNames({ "p-invalid": !isValid })}
							/>
						);
					}}
				/>

				{additionalFields ? additionalFields(formik) : null}
			</Form>
		);
	},
);
