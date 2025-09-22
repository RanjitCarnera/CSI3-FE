import type { FormikProps } from "formik/dist/types";
import React from "react";
import { DefaultCalendarComponent } from "@components/ui/DefaultTextInput";
import { TkButtonLink } from "@components/ui/TkButtonLink";
import { ValidatedField } from "@components/ui/ValidatedField";
import { FormFactory, type FormFactoryFormState } from "@utils/form-factory";
import { editExpirationDateFormSchema } from "./edit-expiration-date-form.consts";

class Impl extends FormFactory<typeof editExpirationDateFormSchema> {
	protected getFormSchema: () => typeof editExpirationDateFormSchema = () =>
		editExpirationDateFormSchema;

	protected hasSubmitButton: boolean = false;

	protected getFormFields(
		form: FormikProps<FormFactoryFormState<typeof editExpirationDateFormSchema>>,
	): () => React.ReactNode {
		return () => (
			<>
				<ValidatedField<FormFactoryFormState<typeof editExpirationDateFormSchema>, string>
					className="mb-4"
					name={"expirationDate"}
					label={"Expiration date"}
					formikConfig={form}
					placeholder={"Expiration date..."}
					component={(r) => (
						<div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
							<DefaultCalendarComponent {...r} />
							<TkButtonLink
								icon={"pi pi-times"}
								iconPos={"left"}
								label={""}
								type={"button"}
								tooltip={"Clear expiration date"}
								onClick={() => {
									r.updateField(undefined);
								}}
							/>
						</div>
					)}
				/>
			</>
		);
	}
}

export const EditExpirationDateForm = new Impl().create();
