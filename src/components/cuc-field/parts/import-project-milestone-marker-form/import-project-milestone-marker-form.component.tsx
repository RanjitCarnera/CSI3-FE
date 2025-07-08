import { Form } from "@thekeytechnology/framework-react-components";
import { type FormikProps, useFormik } from "formik";
import React, { useImperativeHandle } from "react";
import { useFragment } from "react-relay";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { importProjectMilestoneMarkerFormSchema } from "@components/cuc-field/parts/import-project-milestone-marker-form/import-project-milestone-marker-form.consts";
import { PROJECT_FRAGMENT } from "@components/cuc-field/parts/import-project-milestone-marker-form/import-project-milestone-marker-form.graphql";
import { FormProjectMilestoneSelect } from "@components/form/form-project-milestone-select";
import { ValidatedField } from "@components/ui/ValidatedField";
import { type importProjectMilestoneMarkerForm_ProjectFragment$key } from "@relay/importProjectMilestoneMarkerForm_ProjectFragment.graphql";
import { type FormFactoryFormState, type FormFactoryProps } from "@utils/form-factory";

type ImportProjectMilestoneMarkerFormProps = {
	projectFragmentRef?: importProjectMilestoneMarkerForm_ProjectFragment$key;
	excludeIds?: string[];
} & FormFactoryProps<typeof importProjectMilestoneMarkerFormSchema>;

export const ImportProjectMilestoneMarkerForm = React.forwardRef<
	FormikProps<FormFactoryFormState<typeof importProjectMilestoneMarkerFormSchema>>,
	ImportProjectMilestoneMarkerFormProps
>(({ initialValues, onSubmit, projectFragmentRef, excludeIds }, ref) => {
	const project = useFragment<importProjectMilestoneMarkerForm_ProjectFragment$key>(
		PROJECT_FRAGMENT,
		projectFragmentRef ?? null,
	);

	const formik: FormikProps<FormFactoryFormState<typeof importProjectMilestoneMarkerFormSchema>> =
		useFormik({
			initialValues,
			validationSchema: toFormikValidationSchema(importProjectMilestoneMarkerFormSchema),
			enableReinitialize: true,
			onSubmit: (values, formikHelpers) => {
				onSubmit(values);
			},
		});

	useImperativeHandle(ref, () => ({
		...formik,
	}));

	const options =
		project?.milestones?.map((m) => ({
			label: m.data.name,
			value: m.id,
			date: m.data.date,
		})) ?? [];

	return (
		<Form onSubmit={formik.handleSubmit}>
			<ValidatedField<
				FormFactoryFormState<typeof importProjectMilestoneMarkerFormSchema>,
				string
			>
				className="mb-4"
				name={"milestoneRef"}
				label={"Project milestone"}
				required={true}
				placeholder={"Choose milestone"}
				formikConfig={formik}
				component={(renderConfig) => (
					<FormProjectMilestoneSelect
						{...renderConfig}
						options={options}
						excludeIds={excludeIds}
					/>
				)}
			/>
		</Form>
	);
});
