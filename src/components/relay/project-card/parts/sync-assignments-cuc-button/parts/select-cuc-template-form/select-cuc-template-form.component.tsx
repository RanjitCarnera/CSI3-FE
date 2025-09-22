import { type FormikProps } from "formik/dist/types";
import React from "react";
import { z } from "zod";
import { FormCucTemplateSelect } from "@components/form/form-cuc-template-select";
import { ValidatedField } from "@components/ui/ValidatedField";
import { FormFactory, type FormFactoryFormState } from "@utils/form-factory";

export const selectCucTemplateFormSchema = z.object({
	cucTemplateRef: z.string(),
});

class Impl extends FormFactory<typeof selectCucTemplateFormSchema> {
	protected getFormSchema: () => typeof selectCucTemplateFormSchema = () =>
		selectCucTemplateFormSchema;

	protected getFormFields(
		form: FormikProps<FormFactoryFormState<typeof selectCucTemplateFormSchema>>,
	): () => React.ReactNode {
		return () => {
			return (
				<>
					<ValidatedField
						name={"cucTemplateRef"}
						formikConfig={form}
						component={FormCucTemplateSelect}
					/>
				</>
			);
		};
	}

	protected hasSubmitButton: boolean = false;
}

export const SelectCucTemplateForm = new Impl().create();
