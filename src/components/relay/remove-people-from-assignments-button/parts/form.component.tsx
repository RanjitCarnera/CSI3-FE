import { type FormikProps } from "formik/dist/types";
import React from "react";
import { z } from "zod";
import { DefaultSwitchComponent } from "@components/ui/DefaultTextInput";
import { ValidatedField } from "@components/ui/ValidatedField";
import { FormFactory, type FormFactoryFormState } from "@utils/form-factory";

export const removePeopleFromAssignmentsFormSchema = z.object({ shouldDelete: z.boolean() });

class Impl extends FormFactory<typeof removePeopleFromAssignmentsFormSchema> {
	protected getFormFields(
		form: FormikProps<FormFactoryFormState<typeof removePeopleFromAssignmentsFormSchema>>,
	): () => React.ReactNode {
		return function () {
			return (
				<>
					<p>Are you sure you want to remove all people from the project assignments?</p>
					<ValidatedField
						name={"shouldDelete"}
						formikConfig={form}
						label={"Delete instead"}
						component={DefaultSwitchComponent}
					/>
				</>
			);
		};
	}

	protected hasSubmitButton: boolean = false;

	protected getFormSchema: () => typeof removePeopleFromAssignmentsFormSchema = () =>
		removePeopleFromAssignmentsFormSchema;
}

export const RemovePeopleFromAssignmentsForm = new Impl().create();
