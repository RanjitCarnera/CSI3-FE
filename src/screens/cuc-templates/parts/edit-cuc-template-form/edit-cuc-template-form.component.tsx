import type { FormikProps } from "formik/dist/types";
import React from "react";
import { CUCField } from "@components/cuc-field";
import { type MarkerInput } from "@components/cuc-field/cuc-field.types";
import { CUCLayer } from "@components/cuc-field/parts/cuc-field-context/cuc-field-context.types";
import { DefaultTextFieldComponent } from "@components/ui/DefaultTextInput";
import { ValidatedField } from "@components/ui/ValidatedField";
import { FormFactory, type FormFactoryFormState } from "@utils/form-factory";
import { cucTemplateSchema } from "./edit-cuc-template-form.consts";

class Impl extends FormFactory<typeof cucTemplateSchema> {
	protected getFormSchema: () => typeof cucTemplateSchema = () => cucTemplateSchema;

	protected hasSubmitButton: boolean = false;

	protected getFormFields(
		form: FormikProps<FormFactoryFormState<typeof cucTemplateSchema>>,
	): () => React.ReactNode {
		return () => (
			<>
				<ValidatedField<FormFactoryFormState<typeof cucTemplateSchema>, string>
					className="mb-4"
					name={"name"}
					label={"Name"}
					formikConfig={form}
					placeholder={"Name..."}
					component={DefaultTextFieldComponent}
				/>
				<ValidatedField<FormFactoryFormState<typeof cucTemplateSchema>, MarkerInput[]>
					name={"cuc"}
					label={"Cuc"}
					formikConfig={form}
					placeholder={"100%..."}
					component={(renderConfig) => (
						<CUCField {...renderConfig} layer={CUCLayer.Layer1} />
					)}
				/>
			</>
		);
	}
}

export const EditCucTemplateForm = new Impl().create();
