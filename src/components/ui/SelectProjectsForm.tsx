import { FormikHelpers, useFormik } from "formik";
import React, { useImperativeHandle } from "react";
import { FormikProps } from "formik/dist/types";
import * as Yup from "yup";
import { ValidatedField } from "./ValidatedField";
import { ProjectsSelectField } from "../relay/ProjectsSelectField";
import { Form } from "@thekeytechnology/framework-react-components";

export interface SelectProjectsFormState {
	projectIds?: string[];
}

interface OwnProps {
	excludeIds: string[];
	initialState?: SelectProjectsFormState;
	onSubmit: (
		values: SelectProjectsFormState,
		formikHelpers: FormikHelpers<SelectProjectsFormState>,
	) => void;
}

export const SelectProjectsForm = React.forwardRef<FormikProps<SelectProjectsFormState>, OwnProps>(
	({ excludeIds, initialState, onSubmit }, ref) => {
		const formik = useFormik<SelectProjectsFormState>({
			initialValues: {
				projectIds: initialState?.projectIds || [],
			},
			enableReinitialize: true,
			validationSchema: Yup.object().shape({
				projectIds: Yup.array()
					.min(1, "Please select at least one project.")
					.required("Projects is a required field."),
			}),
			onSubmit: onSubmit,
		});

		useImperativeHandle(ref, () => ({
			...formik,
		}));

		return (
			<Form onSubmit={formik.handleSubmit}>
				<ValidatedField<SelectProjectsFormState, string[]>
					className="mb-4"
					name={"projectIds"}
					label={"Selected Projects"}
					required={true}
					formikConfig={formik}
					component={(fieldConfig) => {
						return (
							<ProjectsSelectField
								excludeIds={excludeIds}
								fieldConfig={fieldConfig}
							/>
						);
					}}
				/>
			</Form>
		);
	},
);
