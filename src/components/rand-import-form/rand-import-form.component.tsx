import { Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import { type FormikProps } from "formik/dist/types";
import React, { useImperativeHandle } from "react";
import * as Yup from "yup";
import { ProjectFromRandSelect } from "@components/project-from-rand-select";
import {
	type ImportFromRandFormState,
	type RandImportFormProps,
} from "@components/rand-import-form/rand-import-form.types";
import { ValidatedField } from "../ui/ValidatedField";

export const RandImportForm = React.forwardRef<
	FormikProps<ImportFromRandFormState>,
	RandImportFormProps
>(({ onSubmit }, ref) => {
	const formik = useFormik<ImportFromRandFormState>({
		initialValues: {
			selectedProjectId: undefined,
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			selectedProjectId: Yup.string().required("Selected project is required."),
		}),
		onSubmit,
	});

	useImperativeHandle(ref, () => ({
		...formik,
	}));

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<ImportFromRandFormState, string>
				className="mb-4"
				name={"selectedProjectId"}
				label={"Selected project"}
				required={true}
				placeholder={"Choose project"}
				formikConfig={formik}
				component={ProjectFromRandSelect}
			/>
		</Form>
	);
});
