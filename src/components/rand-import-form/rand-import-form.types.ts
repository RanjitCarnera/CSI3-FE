import { type FormikHelpers } from "formik";

export interface ImportFromRandFormState {
	selectedProjectId?: string;
}

export interface RandImportFormProps {
	onSubmit: (
		values: ImportFromRandFormState,
		formikHelpers: FormikHelpers<ImportFromRandFormState>,
	) => void;
}
