import type { FormikProps } from "formik";
import type { ReactNode } from "react";
import { z } from "zod";
import { DefaultPercentageFieldComponent } from "@components/ui/DefaultTextInput";
import { ValidatedField } from "@components/ui/ValidatedField";
import { FormFactory, type FormFactoryFormState } from "@utils/form-factory";

const selectIntervalPercentageFormSchema = z.object({
	number: z.coerce.number(),
});

class Impl extends FormFactory<typeof selectIntervalPercentageFormSchema> {
	protected getFormSchema: () => typeof selectIntervalPercentageFormSchema = () =>
		selectIntervalPercentageFormSchema;

	protected getFormFields(
		form: FormikProps<FormFactoryFormState<typeof selectIntervalPercentageFormSchema>>,
	): () => ReactNode {
		return () => (
			<>
				<ValidatedField
					name={"number"}
					formikConfig={form}
					component={DefaultPercentageFieldComponent}
				/>
			</>
		);
	}

	protected hasSubmitButton: boolean = false;
}

export const SelectIntervalPercentageForm = new Impl().create();
