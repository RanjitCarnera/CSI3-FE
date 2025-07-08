import {
	FormDialogButton,
	TkComponentsContext,
} from "@thekeytechnology/framework-react-components";
import React from "react";
import { useFragment, useMutation } from "react-relay";
import { toast } from "react-toastify";
import { HarkinsTheme } from "@corestyle/component-theme/component-theme";
import { type revertToAssessmentButton_AssessmentFragment$key } from "@relay/revertToAssessmentButton_AssessmentFragment.graphql";
import { type revertToAssessmentButton_RevertToAssessmentMutation } from "@relay/revertToAssessmentButton_RevertToAssessmentMutation.graphql";
import { RevertToAssessmentForm } from "@screens/skill-assessments/parts/revert-to-assessment-button/parts/revert-to-assessment-form/revert-to-assessment-form.component";
import {
	ASSESSMENT_FRAGMENT,
	REVERT_TO_ASSESSMENT_MUTATION,
} from "@screens/skill-assessments/parts/revert-to-assessment-button/revert-to-assessment-button.graphql";

export const RevertToAssessmentButton = ({
	assessmentFragmentRef,
}: {
	assessmentFragmentRef: revertToAssessmentButton_AssessmentFragment$key;
}) => {
	const assessment = useFragment<revertToAssessmentButton_AssessmentFragment$key>(
		ASSESSMENT_FRAGMENT,
		assessmentFragmentRef,
	);
	const [revertToAssessment, isRevertingToAssessment] =
		useMutation<revertToAssessmentButton_RevertToAssessmentMutation>(
			REVERT_TO_ASSESSMENT_MUTATION,
		);
	const createOnSubmitHandler = (hide: () => void) => () => {
		revertToAssessment({
			variables: {
				input: {
					assessmentId: assessment.id,
					personId: assessment.person!.id,
				},
			},
			updater: (config) => {
				const skills = config.get(
					`client:${assessment.person!.id}:__Person_skills_connection`,
				);

				if (skills != null) {
					skills.invalidateRecord();
				}
			},
			onCompleted: () => {
				hide();
			},
			onError: () => {
				toast.error("An error occurred.");
				hide();
			},
		});
	};
	return (
		<TkComponentsContext.Provider
			value={{
				...HarkinsTheme,
				FormDialog: {
					...HarkinsTheme.FormDialog,
					SaveText: isRevertingToAssessment ? "Reverting..." : "Revert",
				},
			}}
		>
			<FormDialogButton<{}>
				title={"Reset Attributes"}
				buttonContent={{ label: "Revert" }}
				buttonVariant={"subtle"}
				disabled={isRevertingToAssessment}
			>
				{(formRef, hide) => (
					<RevertToAssessmentForm
						ref={formRef}
						assessmentFragmentRef={assessment}
						onHide={hide}
						onSubmit={createOnSubmitHandler(hide)}
					/>
				)}
			</FormDialogButton>
		</TkComponentsContext.Provider>
	);
};
