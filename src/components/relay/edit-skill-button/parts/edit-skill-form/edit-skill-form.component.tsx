import {
	type DefaultFormProps,
	DefaultTextFieldComponent,
	Form,
	ValidatedField,
} from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import { type FormikProps } from "formik/dist/types";
import React, { useImperativeHandle } from "react";
import * as Yup from "yup";
import { type EditSkillButtonFormState } from "@components/relay/edit-skill-button/parts/edit-skill-form/edit-skill-form.types";
import { SkillCategorySelect } from "@components/relay/SkillCategorySelect";
import {
	DefaultNumberFieldComponent,
	DefaultStringArrayField,
	DefaultSwitchComponent,
	DefaultTextAreaComponent,
} from "@components/ui/DefaultTextInput";

export const EditSkillForm = React.forwardRef<
	FormikProps<EditSkillButtonFormState>,
	DefaultFormProps<EditSkillButtonFormState>
>(({ initialState, onSubmit }, ref) => {
	const formik = useFormik<EditSkillButtonFormState>({
		initialValues: initialState ?? {
			name: "",
			skillCategoryRef: "",
			dimension: "binary",
			description: "",
			dimensionCount: 10,
			dimensionExplanations: [],
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			name: Yup.string().required(),
			skillCategoryRef: Yup.string().required(),
		}),
		onSubmit,
	});

	useImperativeHandle(ref, () => ({
		...formik,
	}));

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<EditSkillButtonFormState, string>
				name={"name"}
				label={"Name"}
				required={true}
				formikConfig={formik}
				component={DefaultTextFieldComponent}
			/>
			<ValidatedField<EditSkillButtonFormState, string>
				name={"skillCategoryRef"}
				label={"Attribute Category"}
				required={true}
				formikConfig={formik}
				component={SkillCategorySelect}
			/>
			<ValidatedField<EditSkillButtonFormState, string>
				name={"description"}
				label={"Description"}
				required={false}
				formikConfig={formik}
				component={(renderConfig) => <DefaultTextAreaComponent {...renderConfig} />}
			/>

			<ValidatedField
				name={"dimension"}
				label={"Binary Skill / Range Skill"}
				formikConfig={formik}
				component={(renderConfig) => (
					<DefaultSwitchComponent
						{...renderConfig}
						fieldValue={renderConfig.fieldValue === "numerical"}
						updateField={(e) => {
							renderConfig.updateField(e ? "numerical" : "binary");
						}}
					/>
				)}
			/>
			{formik.values.dimension === "numerical" && (
				<>
					<ValidatedField<EditSkillButtonFormState, number>
						name={"dimensionCount"}
						label={"Range"}
						required={formik.values.dimension === "numerical"}
						formikConfig={formik}
						component={(renderConfig) => (
							<DefaultNumberFieldComponent {...renderConfig} step={1} />
						)}
					/>
					<ValidatedField<EditSkillButtonFormState, string[]>
						name={"dimensionExplanations"}
						label={"Explanations"}
						required={false}
						formikConfig={formik}
						component={(renderConfig) => (
							<DefaultStringArrayField
								{...renderConfig}
								emptyMessage={"If left blank, default Explanations will be used"}
								step={1}
							/>
						)}
					/>
				</>
			)}
		</Form>
	);
});
