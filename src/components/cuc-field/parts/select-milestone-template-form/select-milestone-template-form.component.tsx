import { Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import type { FormikProps } from "formik/dist/types";
import React, { forwardRef, useImperativeHandle } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { FormMilestoneTemplateSelect } from "@components/cuc-field/parts/form-milestone-template-select";
import { ValidatedField } from "@components/ui/ValidatedField";
import { type FormFactoryFormState, type FormFactoryProps } from "@utils/form-factory";
import { selectMilestoneTemplateFormSchema } from "./select-milestone-template-form.consts";

export const SelectMilestoneTemplateForm = forwardRef<
	FormikProps<FormFactoryFormState<typeof selectMilestoneTemplateFormSchema>>,
	FormFactoryProps<typeof selectMilestoneTemplateFormSchema> & { alwaysExcludes: string[] }
>(({ initialValues, onSubmit, alwaysExcludes }, ref) => {
	const form: FormikProps<FormFactoryFormState<typeof selectMilestoneTemplateFormSchema>> =
		useFormik({
			validationSchema: toFormikValidationSchema(selectMilestoneTemplateFormSchema),
			initialValues,
			onSubmit: (values) => {
				void onSubmit(values);
			},
		});

	useImperativeHandle(ref, () => form);
	return (
		<Form
			onSubmit={(e) => {
				form.handleSubmit(e);
			}}
		>
			<ValidatedField<
				FormFactoryFormState<typeof selectMilestoneTemplateFormSchema>,
				string | undefined
			>
				name={"name"}
				formikConfig={form}
				component={(renderConfig) => (
					<FormMilestoneTemplateSelect
						{...renderConfig}
						alwaysExcludes={alwaysExcludes}
					/>
				)}
			/>
		</Form>
	);
});
