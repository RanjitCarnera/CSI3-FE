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
import type { PreferredViewType } from "@relay/preferredViewTypeForm_SetPreferredViewTypeMutation.graphql";
import { type unitSystemForm_QueryFragment$key } from "@relay/unitSystemForm_QueryFragment.graphql";
import { type unitSystemForm_SetUnitSystemMutation } from "@relay/unitSystemForm_SetUnitSystemMutation.graphql";
import {
	QUERY_FRAGMENT,
	SET_UNIT_SYSTEM_MUTATION,
} from "@screens/personal-data/parts/unit-system-form/unit-system-form.graphql";
import {
	type UnitSystemFormProps,
	type UnitSystemFormState,
} from "@screens/personal-data/parts/unit-system-form/unit-system-form.types";

export const UnitSystemForm = ({ queryFragmentRef }: UnitSystemFormProps) => {
	const query = useFragment<unitSystemForm_QueryFragment$key>(QUERY_FRAGMENT, queryFragmentRef);

	const [commit, isInFlight] =
		useMutation<unitSystemForm_SetUnitSystemMutation>(SET_UNIT_SYSTEM_MUTATION);
	const dispatch = useDispatch();

	const formik = useFormik<UnitSystemFormState>({
		initialValues: {
			unitSystem: query.Viewer.Auth.currentUser?.user.extension.unitSystem ?? "Imperial",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({}),
		onSubmit: (data) => {
			commit({
				variables: {
					input: {
						unitSystem: data.unitSystem,
					},
				},
				onCompleted: (response) => {
					if (!response.Admin.Auth.setUnitSystem?.user.extension.unitSystem) return;
					dispatch(
						updateExtension({
							unitSystem:
								response.Admin.Auth.setUnitSystem?.user.extension.unitSystem,
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
				<ValidatedField<UnitSystemFormState, PreferredViewType | undefined>
					className="mb-4"
					name={"unitSystem"}
					label={"Unit System"}
					required={true}
					formikConfig={formik}
					component={(renderConfig) => (
						<Dropdown
							options={[
								{ value: "Imperial", label: "Imperial" },
								{ value: "Metric", label: "Metric" },
							]}
							defaultValue={"Imperial"}
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
