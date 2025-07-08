import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
import { ValidatedField } from "../ui/ValidatedField";
import React, { useImperativeHandle } from "react";
import { FormikProps } from "formik/dist/types";
import { ProjectFromDynamicsSelect } from "./ProjectFromDynamicsSelect";
import { Form } from "@thekeytechnology/framework-react-components";

export interface ImportFromDynamicsFormState {
	selectedProjectId?: string;
}

interface OwnProps {
	onSubmit: (
		values: ImportFromDynamicsFormState,
		formikHelpers: FormikHelpers<ImportFromDynamicsFormState>,
	) => void;
}

export const DynamicsImportForm = React.forwardRef<
	FormikProps<ImportFromDynamicsFormState>,
	OwnProps
>(({ onSubmit }, ref) => {
	const formik = useFormik<ImportFromDynamicsFormState>({
		initialValues: {
			selectedProjectId: undefined,
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			selectedProjectId: Yup.string().required("Selected project is required."),
		}),
		onSubmit: onSubmit,
	});

	useImperativeHandle(ref, () => ({
		...formik,
	}));

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<ImportFromDynamicsFormState, string>
				className="mb-4"
				name={"selectedProjectId"}
				label={"Selected project"}
				required={true}
				placeholder={"Choose project"}
				formikConfig={formik}
				component={ProjectFromDynamicsSelect}
			/>
		</Form>
	);
});
