import { type FormikHelpers } from "formik";
import { type DynamicsSyncFields } from "@relay/syncDynamicsProjectsButton_SyncProjectsFromDynamicsMutation.graphql";

export interface SyncDynamicsProjectsFormState {
	dynamicsSyncFields: DynamicsSyncFields[];
}

export interface SyncDynamicsProjectFormProps {
	onSubmit: (
		values: SyncDynamicsProjectsFormState,
		formikHelpers: FormikHelpers<SyncDynamicsProjectsFormState>,
	) => void;
}
