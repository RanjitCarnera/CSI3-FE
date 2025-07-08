import { Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import React from "react";
import { useFragment, useMutation } from "react-relay";
import * as Yup from "yup";
import { DefaultStringArrayField } from "@components/ui/DefaultTextInput";
import { TkButton } from "@components/ui/TkButton";
import { ValidatedField } from "@components/ui/ValidatedField";
import { type editNumericalDimensionExplanationsForm_EditNumericalDimensionExplanationsMutation } from "@relay/editNumericalDimensionExplanationsForm_EditNumericalDimensionExplanationsMutation.graphql";
import { type editNumericalDimensionExplanationsForm_QueryFragment$key } from "@relay/editNumericalDimensionExplanationsForm_QueryFragment.graphql";
import {
	EDIT_NUMERICAL_EXPLANATIONS_MUTATION,
	QUERY_FRAGMENT,
} from "@screens/account-settings/parts/edit-numerical-dimension-explanations-form/edit-numerical-dimension-explanations-form.graphql";
import { type EditNumericalDimensionExplanationsFormProps } from "@screens/account-settings/parts/edit-numerical-dimension-explanations-form/edit-numerical-dimension-explanations-form.types";

interface EditNumericalDimensionExplanationsFormState {
	numericalDimensionExplanations: string[];
}
export const EditNumericalDimensionExplanationsForm = ({
	queryFragment,
}: EditNumericalDimensionExplanationsFormProps) => {
	const query = useFragment<editNumericalDimensionExplanationsForm_QueryFragment$key>(
		QUERY_FRAGMENT,
		queryFragment,
	);
	const [edit, isEditing] =
		useMutation<editNumericalDimensionExplanationsForm_EditNumericalDimensionExplanationsMutation>(
			EDIT_NUMERICAL_EXPLANATIONS_MUTATION,
		);

	const numericalDimensionExplanations =
		query.Viewer.Auth.currentAccount?.extensions.find((e) => e.kind === "AccountSettings")
			?.numericalDimensionExplanations ?? [];
	const initialState: EditNumericalDimensionExplanationsFormState = {
		numericalDimensionExplanations: [...numericalDimensionExplanations],
	};
	const formik = useFormik<EditNumericalDimensionExplanationsFormState>({
		initialValues: initialState || {
			numericalDimensionExplanations: ["", "", "", "", "", "", "", "", "", ""],
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			numericalDimensionExplanations: Yup.array().required(),
		}),
		onSubmit: (values, formikHelpers) => {
			edit({
				variables: {
					input: {
						numericalDimensionExplanations: values.numericalDimensionExplanations,
					},
				},
				onCompleted: () => {},
			});
		},
	});

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<EditNumericalDimensionExplanationsFormState, string[]>
				name={"numericalDimensionExplanations"}
				label={"Name"}
				required={true}
				formikConfig={formik}
				component={(renderConfig) => (
					<DefaultStringArrayField
						{...renderConfig}
						emptyMessage={"If left blank, default Explanations will be used"}
					/>
				)}
			/>
			<TkButton
				disabled={isEditing || formik.isSubmitting}
				type="submit"
				label={"Set Explanations"}
				className="p-mt-2"
			/>
		</Form>
	);
};
