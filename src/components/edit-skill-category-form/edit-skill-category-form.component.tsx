import { type DefaultFormProps, Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import { type FormikProps } from "formik/dist/types";
import React, { useImperativeHandle } from "react";
import { type EditSkillCategoryFormState } from "@components/edit-skill-category-form/edit-skill-category-form.types";
import { DefaultTextFieldComponent } from "@components/ui/DefaultTextInput";
import { ValidatedField } from "@components/ui/ValidatedField";

export const EditSkillCategoryForm = React.forwardRef<
	FormikProps<EditSkillCategoryFormState>,
	DefaultFormProps<EditSkillCategoryFormState>
>(({ initialState, onSubmit }, ref) => {
	const formik = useFormik<EditSkillCategoryFormState>({
		initialValues: initialState ?? {
			name: "",
		},
		onSubmit,
	});
	useImperativeHandle(ref, () => ({
		...formik,
	}));
	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<EditSkillCategoryFormState, string>
				className="mb-4"
				name={"name"}
				label={"Name"}
				required={true}
				formikConfig={formik}
				component={DefaultTextFieldComponent}
			/>
		</Form>
	);
});
