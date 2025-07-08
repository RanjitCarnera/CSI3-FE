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

import {
	type UtilizationDisplay,
	type utilizationDisplayForm_QueryFragment$key,
} from "@relay/utilizationDisplayForm_QueryFragment.graphql";
import { type utilizationDisplayForm_setUtilizationDisplaySettingMutation } from "@relay/utilizationDisplayForm_setUtilizationDisplaySettingMutation.graphql";
import {
	type UtilizationDisplayFormProps,
	type UtilizationDisplayFormState,
} from "@screens/personal-data/parts/utilization-display-form/utilization-display-form.types";
import {
	QUERY_FRAGMENT,
	SET_UTILIZATION_DISPLAY_SETTING_MUTATION,
} from "./utilization-display-form.graphql";

export const UtilizationDisplayForm = ({ queryFragmentRef }: UtilizationDisplayFormProps) => {
	const query = useFragment<utilizationDisplayForm_QueryFragment$key>(
		QUERY_FRAGMENT,
		queryFragmentRef,
	);

	const [commit, isInFlight] =
		useMutation<utilizationDisplayForm_setUtilizationDisplaySettingMutation>(
			SET_UTILIZATION_DISPLAY_SETTING_MUTATION,
		);
	const dispatch = useDispatch();

	const formik = useFormik<UtilizationDisplayFormState>({
		initialValues: {
			utilizationDisplay:
				query.Viewer.Auth.currentUser?.user.extension.utilizationDisplay ??
				"UtilizationForecast",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({}),
		onSubmit: (data) => {
			commit({
				variables: {
					input: {
						utilizationDisplaySetting: data.utilizationDisplay,
					},
				},
				onCompleted: (response) => {
					if (
						!response.Admin.Auth.setUtilizationDisplaySetting?.user.extension
							.utilizationDisplay
					)
						return;
					dispatch(
						updateExtension({
							utilizationDisplay:
								response.Admin.Auth.setUtilizationDisplaySetting?.user.extension
									.utilizationDisplay,
						}),
					);
					formik.setSubmitting(false);
					window.location.reload();
				},
			});
		},
	});

	return (
		<div>
			<Form onSubmit={formik.handleSubmit}>
				<ValidatedField<UtilizationDisplayFormState, UtilizationDisplay | undefined>
					className="mb-4"
					name={"utilizationDisplay"}
					label={"Utilization display"}
					required={true}
					formikConfig={formik}
					component={(renderConfig) => (
						<Dropdown
							options={[
								{ value: "UtilizationForecast", label: "Utilization forecast" },
								{ value: "UtilizationToday", label: "Utilization today" },
							]}
							defaultValue={"UtilizationForecast"}
							value={renderConfig.fieldValue}
							onChange={(e) => {
								renderConfig.updateField(e.value);
							}}
						/>
					)}
				/>

				<TkButton
					disabled={isInFlight || formik.isSubmitting}
					type="submit"
					label={"Save"}
					className="p-mt-2"
				/>
			</Form>
		</div>
	);
};
