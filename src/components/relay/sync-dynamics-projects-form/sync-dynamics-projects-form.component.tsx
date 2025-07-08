import { Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import { type FormikProps } from "formik/dist/types";
import React, { useImperativeHandle } from "react";
import * as Yup from "yup";
import {
	type SyncDynamicsProjectFormProps,
	type SyncDynamicsProjectsFormState,
} from "@components/relay/sync-dynamics-projects-form/sync-dynamics-project-form.interface";
import { type DynamicsSyncFields } from "@relay/syncDynamicsProjectsButton_SyncProjectsFromDynamicsMutation.graphql";
import { ValidatedField } from "../../ui/ValidatedField";
import { DynamicsSyncFieldsSelect } from "../dynamics-sync-fields-select";

export const SyncDynamicsProjectsForm = React.forwardRef<
	FormikProps<SyncDynamicsProjectsFormState>,
	SyncDynamicsProjectFormProps
>(({ onSubmit }, ref) => {
	const formik = useFormik<SyncDynamicsProjectsFormState>({
		initialValues: {
			dynamicsSyncFields: [],
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
			<ValidatedField<SyncDynamicsProjectsFormState, DynamicsSyncFields[]>
				className="mb-4"
				name={"dynamicsSyncFields"}
				label={"Sync Fields"}
				formikConfig={formik}
				component={DynamicsSyncFieldsSelect}
			/>
		</Form>
	);
});
