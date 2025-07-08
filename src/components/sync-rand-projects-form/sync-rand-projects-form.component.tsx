import { Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import { type FormikProps } from "formik/dist/types";
import React, { useImperativeHandle } from "react";
import * as Yup from "yup";
import { RandSyncFieldsSelect } from "@components/rand-sync-fields-select";
import {
	type SyncRandProjectFormProps,
	type SyncRandProjectsFormState,
} from "@components/sync-rand-projects-form/sync-rand-project-form.interface";
import { ValidatedField } from "@components/ui/ValidatedField";
import { type RandSyncFields } from "@relay/syncRandProjectsButton_SyncProjectsFromRandMutation.graphql";

export const SyncRandProjectsForm = React.forwardRef<
	FormikProps<SyncRandProjectsFormState>,
	SyncRandProjectFormProps
>(({ onSubmit }, ref) => {
	const formik = useFormik<SyncRandProjectsFormState>({
		initialValues: {
			randSyncFields: [],
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({}),
		onSubmit,
	});

	useImperativeHandle(ref, () => ({
		...formik,
	}));
	return (
		<Form onSubmit={formik.handleSubmit} style={{ maxWidth: "32rem" }}>
			<ValidatedField<SyncRandProjectsFormState, RandSyncFields[]>
				className="mb-4"
				name={"randSyncFields"}
				label={"Sync Fields"}
				formikConfig={formik}
				component={RandSyncFieldsSelect}
			/>
		</Form>
	);
});
