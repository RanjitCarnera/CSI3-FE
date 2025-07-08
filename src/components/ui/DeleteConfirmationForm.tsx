import { useFormik } from "formik";
import * as Yup from "yup";
import { TkDialog } from "./TkDialog";
import { TkButtonLink } from "./TkButtonLink";
import { ValidatedField } from "./ValidatedField";
import { DefaultTextFieldComponent } from "./DefaultTextInput";
import React from "react";
import { TkMessage } from "./TkMessage";
import { Form } from "@thekeytechnology/framework-react-components";

export interface EditProjectFormState {
	confirmation?: string;
}

interface OwnProps {
	title: string;
	onCompleted: () => void;

	isVisible: boolean;
	onHide: () => void;
}

export const DeleteConfirmationForm = ({ title, onCompleted, isVisible, onHide }: OwnProps) => {
	const formik = useFormik<EditProjectFormState>({
		initialValues: {
			confirmation: "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			confirmation: Yup.string()
				.oneOf(["DELETE"], "Please type DELETE")
				.required("Please type DELETE"),
		}),
		onSubmit: (values, { setSubmitting, resetForm }) => {
			setSubmitting(false);
			resetForm({});
			onCompleted();
		},
	});

	return (
		<TkDialog
			dismissableMask={true}
			header={<h1>{title}</h1>}
			visible={isVisible}
			onHide={() => onHide()}
			footer={
				<div className="flex">
					<TkButtonLink
						disabled={formik.isSubmitting}
						type="button"
						onClick={() => onHide()}
						label={"Cancel"}
						className="m-auto w-auto"
					/>
					<TkButtonLink
						disabled={formik.isSubmitting}
						onClick={() => formik.handleSubmit()}
						label={"Confirm Deletion"}
						className="m-auto w-auto"
					/>
				</div>
			}
		>
			<TkMessage
				className="mb-5 w-12"
				severity="warn"
				content={<div>Please type DELETE to confirm deletion.</div>}
			/>

			<Form onSubmit={formik.handleSubmit}>
				<ValidatedField<EditProjectFormState, string>
					className="mb-4"
					name={"confirmation"}
					label={"Please type DELETE to confirm"}
					placeholder={"Type DELETE to confirm"}
					required={true}
					formikConfig={formik}
					component={DefaultTextFieldComponent}
				/>
			</Form>
		</TkDialog>
	);
};
