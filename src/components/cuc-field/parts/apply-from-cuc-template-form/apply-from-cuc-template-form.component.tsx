import { type FormikProps } from "formik";
import { type ReactNode } from "react";
import { FormCucTemplateSelect } from "@components/form/form-cuc-template-select";
import { ValidatedField } from "@components/ui/ValidatedField";
import { FormFactory, type FormFactoryFormState } from "@utils/form-factory";
import { applyFromCucTemplateFormSchema } from "./apply-from-cuc-template-form.consts";

class Impl extends FormFactory<typeof applyFromCucTemplateFormSchema> {
	protected getFormSchema: () => typeof applyFromCucTemplateFormSchema = () =>
		applyFromCucTemplateFormSchema;

	protected getFormFields(
		form: FormikProps<FormFactoryFormState<typeof applyFromCucTemplateFormSchema>>,
	): () => ReactNode {
		return () => (
			<>
				<ValidatedField
					name={"cucTemplateRef"}
					formikConfig={form}
					component={FormCucTemplateSelect}
				/>
			</>
		);
	}

	protected hasSubmitButton: boolean = false;
}

export const ApplyFromCucTemplateForm = new Impl().create();
