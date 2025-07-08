import { useFormik } from "formik";
import { type FormikProps } from "formik/dist/types";
import React, { forwardRef, useImperativeHandle } from "react";
import { useFragment } from "react-relay";
import { type revertToAssessmentForm_AssessmentFragment$key } from "@relay/revertToAssessmentForm_AssessmentFragment.graphql";
import { ASSESSMENT_FRAGMENT } from "@screens/skill-assessments/parts/revert-to-assessment-button/parts/revert-to-assessment-form/revert-to-assessment-form.graphql";
import { type RevertToAssessmentFormProps } from "@screens/skill-assessments/parts/revert-to-assessment-button/parts/revert-to-assessment-form/revert-to-assessment-form.types";

export const RevertToAssessmentForm = forwardRef<FormikProps<{}>, RevertToAssessmentFormProps>(
	({ assessmentFragmentRef, onSubmit }, ref) => {
		const assessment = useFragment<revertToAssessmentForm_AssessmentFragment$key>(
			ASSESSMENT_FRAGMENT,
			assessmentFragmentRef,
		);

		const formik = useFormik<{}>({
			initialValues: {},
			enableReinitialize: true,
			onSubmit,
		});

		useImperativeHandle(ref, () => ({
			...formik,
		}));

		return (
			<>
				<div>
					Are you sure you want to revert {assessment.person?.name}'s attributes back to
					the assessment: '{assessment.template?.name}' from{" "}
					{assessment.status.finishedAt}?
				</div>
			</>
		);
	},
);
