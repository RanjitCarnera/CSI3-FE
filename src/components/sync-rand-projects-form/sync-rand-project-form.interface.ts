import { type FormikHelpers } from "formik";
import { type RandSyncFields } from "@relay/syncRandProjectsButton_SyncProjectsFromRandMutation.graphql";

export interface SyncRandProjectsFormState {
	randSyncFields: RandSyncFields[];
}
export interface SyncRandProjectFormProps {
	onSubmit: (
		values: SyncRandProjectsFormState,
		formikHelpers: FormikHelpers<SyncRandProjectsFormState>,
	) => void;
}
