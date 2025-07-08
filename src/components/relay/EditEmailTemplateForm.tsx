import { useFormik } from "formik";
import { Button } from "primereact/button";
import React from "react";
import * as Yup from "yup";
import { DefaultEditorComponent, DefaultTextFieldComponent } from "../ui/DefaultTextInput";
import { ValidatedField } from "../ui/ValidatedField";
import { Form } from "@thekeytechnology/framework-react-components";

export interface FormState {
	subject?: string;
	preview?: string;
	body?: string;
}

interface OwnProps {
	loading?: boolean;
	initialValues?: FormState;
	variables: readonly string[];
	onSubmit: (values: FormState) => void;
}

export const EditEmailTemplateForm = ({
	variables,
	loading,
	initialValues,
	onSubmit,
}: OwnProps) => {
	const formik = useFormik<FormState>({
		initialValues: {
			subject: initialValues?.subject ?? "Subject",
			preview: initialValues?.preview ?? "Preview Text",
			body: initialValues?.body ?? "Message",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			subject: Yup.string().required("Subject is required"),
			body: Yup.string().required("Message is required"),
		}),
		onSubmit: (values, { setSubmitting, resetForm }) => {
			onSubmit({
				...values,
			});
			setSubmitting(false);
			resetForm({});
		},
	});

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<FormState, string>
				name={"subject"}
				label={"Subject"}
				component={DefaultTextFieldComponent}
				formikConfig={formik}
			/>
			<ValidatedField<FormState, string>
				name={"preview"}
				label={"Preview Text"}
				helpText={"Some mail applications show this text as a preview"}
				component={DefaultTextFieldComponent}
				formikConfig={formik}
			/>

			<ValidatedField<FormState, string>
				name={"body"}
				label={"Message"}
				helpText={
					"Please be sure to only use styles / features that are supported by email programs."
				}
				component={DefaultEditorComponent}
				formikConfig={formik}
			/>

			<h3>Available variables</h3>
			<p>
				These variables can be inserted into the email template and are dynamically replaced
				before the email is sent.
			</p>
			<ul>
				{variables.map((variable) => {
					return (
						<li key={variable}>
							<strong>%%{variable}%%</strong> - {EMAIL_VARIABLES[variable]}
						</li>
					);
				})}
			</ul>

			<Button disabled={loading} type="submit" label="Save" className="p-mt-2" />
		</Form>
	);
};

export const EMAIL_VARIABLES: { [key: string]: string } = {
	authenticationToken: "Authentication token (is part of the link)",
	frontendUrl: "URL of the PROJEXION frontend",
	projectName: "Name of the project",
	projectId: "ID of the project (usable for links)",
	errorMessage: "Explanation of the error.",
};
