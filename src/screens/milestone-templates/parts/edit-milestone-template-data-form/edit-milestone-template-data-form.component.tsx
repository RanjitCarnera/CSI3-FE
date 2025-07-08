import { type FormikProps } from "formik/dist/types";
import React from "react";
import {
	DefaultPercentageFieldComponent,
	DefaultTextFieldComponent,
} from "@components/ui/DefaultTextInput";
import { ValidatedField } from "@components/ui/ValidatedField";
import { milestoneTemplateDataSchema } from "@screens/milestone-templates/parts/edit-milestone-template-data-form/edit-milestone-template-data-form.consts";
import { FormFactory, type FormFactoryFormState } from "@utils/form-factory";

class Impl extends FormFactory<typeof milestoneTemplateDataSchema> {
	protected getFormSchema: () => typeof milestoneTemplateDataSchema = () =>
		milestoneTemplateDataSchema;

	protected hasSubmitButton: boolean = false;
	protected getFormFields(
		form: FormikProps<FormFactoryFormState<typeof milestoneTemplateDataSchema>>,
	): () => React.ReactNode {
		return () => (
			<>
				<ValidatedField<FormFactoryFormState<typeof milestoneTemplateDataSchema>, string>
					className="mb-4"
					name={"name"}
					label={"Name"}
					helpText={"Will be used to determine milestone name on creation."}
					formikConfig={form}
					placeholder={"Name..."}
					component={DefaultTextFieldComponent}
				/>
				<ValidatedField<FormFactoryFormState<typeof milestoneTemplateDataSchema>, number>
					name={"timeInPercent"}
					label={"Time in %"}
					helpText={
						"At which percentage of a projects lifetime this milestone will be created.."
					}
					formikConfig={form}
					placeholder={"100%..."}
					component={(renderConfig) => (
						<DefaultPercentageFieldComponent {...renderConfig} mode={"decimal"} />
					)}
				/>
			</>
		);
	}
}

export const EditMilestoneTemplateDataForm = new Impl().create();
