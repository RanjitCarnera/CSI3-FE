import {
	type DefaultFormProps,
	Form as FormComponent,
} from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import type { FormikProps } from "formik/dist/types";
import React, { useImperativeHandle } from "react";
import * as Yup from "yup";
import type { AddSelectedProjectsToScenarioButtonFormState } from "@components/add-selected-projects-to-scenario-button/add-selected-projects-to-scenario-button.types";
import { ScenarioSelectField } from "@components/scenario-select-field";
import { ValidatedField } from "@components/ui/ValidatedField";

export const Form = React.forwardRef<
	FormikProps<AddSelectedProjectsToScenarioButtonFormState>,
	DefaultFormProps<AddSelectedProjectsToScenarioButtonFormState>
>(({ initialState, onSubmit }, ref) => {
	const formik = useFormik<AddSelectedProjectsToScenarioButtonFormState>({
		initialValues: initialState ?? {
			scenarioId: "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			scenarioId: Yup.string().required("Scenario is required."),
		}),
		onSubmit,
	});

	useImperativeHandle(ref, () => ({
		...formik,
	}));

	return (
		<FormComponent
			onSubmit={() => {
				formik.handleSubmit();
			}}
		>
			<ValidatedField<AddSelectedProjectsToScenarioButtonFormState, string>
				name={"scenarioId"}
				label={"Scenario"}
				required={true}
				formikConfig={formik}
				component={ScenarioSelectField}
			/>
		</FormComponent>
	);
});
