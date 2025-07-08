import { Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { useFragment, useMutation } from "react-relay";
import * as Yup from "yup";
import { DefaultSwitchComponent } from "@components/ui/DefaultTextInput";
import { TkButton } from "@components/ui/TkButton";
import { ValidatedField } from "@components/ui/ValidatedField";
import { updateExtension } from "@redux/CurrentUserSlice";
import { type volumePerPersonForm_ChangeVolumePerPersonMutation } from "@relay/volumePerPersonForm_ChangeVolumePerPersonMutation.graphql";
import { type volumePerPersonForm_CurrentUser$key } from "@relay/volumePerPersonForm_CurrentUser.graphql";
import {
	CHANGE_VOLUME_PER_PERSON_MUTATION,
	QUERY_FRAGMENT,
} from "@screens/personal-data/parts/volume-per-person-form/volume-per-person-form.graphql";
import {
	type VolumePerPersonFormProps,
	type VolumePerPersonFormState,
} from "@screens/personal-data/parts/volume-per-person-form/volume-per-person-form.types";

export const VolumePerPersonForm = ({ queryFragmentRef }: VolumePerPersonFormProps) => {
	const query = useFragment<volumePerPersonForm_CurrentUser$key>(
		QUERY_FRAGMENT,
		queryFragmentRef,
	);
	const [changeShowVolumePerPerson, isChanging] =
		useMutation<volumePerPersonForm_ChangeVolumePerPersonMutation>(
			CHANGE_VOLUME_PER_PERSON_MUTATION,
		);
	const dispatch = useDispatch();

	const formik = useFormik<VolumePerPersonFormState>({
		initialValues: {
			showVolumePerPerson: query.Viewer.Auth.currentUser?.user.extension.showVolumePerPerson,
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({}),
		onSubmit: (data) => {
			changeShowVolumePerPerson({
				variables: {
					input: {
						showVolumePerPerson: data.showVolumePerPerson ?? false,
					},
				},
				onCompleted: () => {
					dispatch(
						updateExtension({ showVolumePerPerson: data.showVolumePerPerson ?? false }),
					);
					formik.setSubmitting(false);
					window.location.reload();
				},
			});
		},
	});

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<VolumePerPersonFormState, boolean>
				className="mb-4"
				name={"showVolumePerPerson"}
				label={"Show Volume Per Person"}
				required={true}
				formikConfig={formik}
				component={DefaultSwitchComponent}
			/>

			<TkButton
				disabled={isChanging || formik.isSubmitting}
				type="submit"
				label={"Save"}
				className="p-mt-2"
			/>
		</Form>
	);
};
