import { Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import type { FormikProps } from "formik/dist/types";
import React, { forwardRef, type ReactNode, useImperativeHandle } from "react";
import type { z, ZodType } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TkButton } from "@components/ui/TkButton";

export type FormFactoryFormState<T extends ZodType<any, any, any>> = z.infer<T>;
export interface FormFactoryProps<T extends ZodType<any, any, any>> {
	initialValues: FormFactoryFormState<T>;
	onSubmit: (values: FormFactoryFormState<T>) => unknown;
}

/**
 * Used to create a form for editing / creating an entity.
 */
export abstract class FormFactory<T extends ZodType<any, any, any>> {
	protected abstract getFormSchema: () => T;
	protected abstract getFormFields(form: FormikProps<FormFactoryFormState<T>>): () => ReactNode;
	protected abstract hasSubmitButton: boolean;
	/**
	 * Creates a form.
	 */
	create() {
		return forwardRef<FormikProps<T>, FormFactoryProps<T>>(
			({ initialValues, onSubmit }, ref) => {
				const schema = this.getFormSchema();
				const form: FormikProps<typeof schema> = useFormik<FormFactoryFormState<T>>({
					validationSchema: toFormikValidationSchema(schema),
					initialValues,
					onSubmit: (values) => {
						void onSubmit(values);
					},
				});

				useImperativeHandle(ref, () => form);
				// this.runAdditional(form);
				return (
					<Form
						onSubmit={(e) => {
							form.handleSubmit(e);
						}}
					>
						{this.getFormFields(form)()}

						{this.hasSubmitButton && <TkButton type="submit">Submit</TkButton>}
					</Form>
				);
			},
		);
	}
}
