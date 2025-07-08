import { Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import { Dropdown } from "primereact/dropdown";
import React from "react";
import { useDispatch } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import * as Yup from "yup";
import { TkButton } from "@components/ui/TkButton";
import { ValidatedField } from "@components/ui/ValidatedField";
import { updateExtension } from "@redux/CurrentUserSlice";
import { type preferredViewTypeForm_CurrentUser$key } from "@relay/preferredViewTypeForm_CurrentUser.graphql";
import {
	type PreferredViewType,
	type preferredViewTypeForm_SetPreferredViewTypeMutation,
} from "@relay/preferredViewTypeForm_SetPreferredViewTypeMutation.graphql";
import {
	QUERY_FRAGMENT,
	SET_PREFERRED_VIEW_TYPE_MUTATION,
} from "@screens/personal-data/parts/preferred-view-type-form/preferred-view-type-form.graphql";
import {
	type PreferredViewTypeFormProps,
	type PreferredViewTypeFormState,
} from "@screens/personal-data/parts/preferred-view-type-form/preferred-view-type-form.types";

export const PreferredViewTypeForm = ({ queryFragmentRef }: PreferredViewTypeFormProps) => {
	const query = useFragment<preferredViewTypeForm_CurrentUser$key>(
		QUERY_FRAGMENT,
		queryFragmentRef,
	);

	const [setPreferredViewType, isSetting] =
		useMutation<preferredViewTypeForm_SetPreferredViewTypeMutation>(
			SET_PREFERRED_VIEW_TYPE_MUTATION,
		);
	const dispatch = useDispatch();

	const formik = useFormik<PreferredViewTypeFormState>({
		initialValues: {
			preferredViewType:
				query.Viewer.Auth.currentUser?.user.extension.preferredViewType ?? undefined,
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({}),
		onSubmit: (data) => {
			setPreferredViewType({
				variables: {
					input: {
						preferredViewType: data.preferredViewType?.length
							? data.preferredViewType
							: "None",
					},
				},
				onCompleted: () => {
					dispatch(
						updateExtension({ preferredViewType: data.preferredViewType ?? "None" }),
					);
					formik.setSubmitting(false);
					window.location.reload();
				},
			});
		},
	});

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<PreferredViewTypeFormState, PreferredViewType | undefined>
				className="mb-4"
				name={"preferredViewType"}
				label={"Preferred View Type"}
				required={true}
				formikConfig={formik}
				component={(renderConfig) => (
					<Dropdown
						options={[
							{ value: "ProjectView", label: "Project View" },
							{ value: "StaffView", label: "Staff View" },
							{ value: "None", label: "None" },
						]}
						value={renderConfig.fieldValue}
						onChange={(e) => {
							renderConfig.updateField(e.value);
						}}
					/>
				)}
			/>

			<TkButton
				disabled={isSetting || formik.isSubmitting}
				type="submit"
				label={"Save"}
				className="p-mt-2"
			/>
		</Form>
	);
};
