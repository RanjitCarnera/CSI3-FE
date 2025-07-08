import { useFormik } from "formik";
import { type FormikProps } from "formik/dist/types";
import React, { createContext, type SetStateAction, useCallback, useEffect, useState } from "react";
import { type Disposable, useFragment, useMutation, type UseMutationConfig } from "react-relay";
import { type skillAssessmentExecution_AnswerAssessmentMutation } from "@relay/skillAssessmentExecution_AnswerAssessmentMutation.graphql";
import { type skillAssessmentExecution_AssessmentFragment$key } from "@relay/skillAssessmentExecution_AssessmentFragment.graphql";
import { type skillAssessmentExecution_SubmitAssessmentMutation } from "@relay/skillAssessmentExecution_SubmitAssessmentMutation.graphql";
import { NavigationMode } from "@screens/skill-assessment-execution/parts/navigation/navigation.consts";
import {
	ANSWER_ASSESSMENT_MUTATION,
	ASSESSMENT_FRAGMENT,
	SUBMIT_ASSESSMENT_MUTATION,
} from "@screens/skill-assessment-execution/skill-assessment-execution.graphql";
import { type SkillAssessmentExecutionFormState } from "@screens/skill-assessment-execution/skill-assessment-execution.types";
import { useAssessmentExecutionProgress } from "@screens/skill-assessment-execution/skill-assessment-execution.util";

export interface ISkillAssessmentExecutionContext {
	formik?: FormikProps<SkillAssessmentExecutionFormState>;
	submitButtonIsDisabled: boolean;
	setSubmitButtonIsDisabled: React.Dispatch<SetStateAction<boolean>>;
	answer?: (
		a: UseMutationConfig<skillAssessmentExecution_AnswerAssessmentMutation>,
	) => Disposable;
	submit?: (cb?: () => void) => void;
	accountId: string;
	assessmentId: string;
	progress: number;
	navigationMode: NavigationMode;
	isAnswering: boolean;
	isSubmitting: boolean;
}

export const SkillAssessmentExecutionContext = createContext<ISkillAssessmentExecutionContext>({
	formik: undefined,
	setSubmitButtonIsDisabled: () => {},
	submitButtonIsDisabled: false,
	answer: undefined,
	submit: undefined,
	isAnswering: false,
	isSubmitting: false,
	accountId: "",
	assessmentId: "",
	progress: 0,
	navigationMode: NavigationMode.write,
});

export const SkillAssessmentExecutionContextProvider = ({
	children,
	skillAssessmentFragmentRef,
	accountId,
	assessmentId,
	navigationMode,
	password,
}: React.PropsWithChildren<{
	skillAssessmentFragmentRef: skillAssessmentExecution_AssessmentFragment$key;
	accountId: string;
	assessmentId: string;
	navigationMode: NavigationMode;
	password?: string;
}>) => {
	const assessment = useFragment<skillAssessmentExecution_AssessmentFragment$key>(
		ASSESSMENT_FRAGMENT,
		skillAssessmentFragmentRef,
	);
	const isInProgress = assessment.status.kind === "InProgress";

	const initialValues: SkillAssessmentExecutionFormState =
		Object.fromEntries(
			(assessment?.template?.assessedSkills || []).map((skill) => [
				skill.id,
				assessment?.skillAssessments?.find(
					(assessedSkill) => assessedSkill.skill?.id === skill.id,
				)?.value ?? {},
			]),
		) ?? {};

	const [submitButtonIsDisabled, setSubmitButtonIsDisabled] = useState(true);
	const formik = useFormik<SkillAssessmentExecutionFormState>({
		initialValues,
		onSubmit: () => {},
	});
	const progress = useAssessmentExecutionProgress(formik);

	useEffect(() => {
		const isCompleted = Object.values(formik.values).every(
			(e) => Object.entries(e).length !== 0,
		);
		if (isCompleted) {
			setSubmitButtonIsDisabled(false);
		}
	}, [formik.values]);

	const [doAnswer, isAnswering] = useMutation<skillAssessmentExecution_AnswerAssessmentMutation>(
		ANSWER_ASSESSMENT_MUTATION,
	);
	const [doSubmit, isSubmitting] = useMutation<skillAssessmentExecution_SubmitAssessmentMutation>(
		SUBMIT_ASSESSMENT_MUTATION,
	);
	const answer = useCallback(
		(config: UseMutationConfig<skillAssessmentExecution_AnswerAssessmentMutation>) => {
			const disposable: Disposable = { dispose: () => {} };
			if (!isInProgress) return disposable;
			if (isAnswering || isSubmitting) return disposable;
			doAnswer({
				...config,
				variables: {
					...config.variables,
					input: {
						...config.variables.input,
						password,
					},
				},
			});
			return disposable;
		},
		[isAnswering, isSubmitting, isInProgress, submitButtonIsDisabled],
	);
	const submit = useCallback(
		(cb?: () => void) => {
			if (isSubmitting || isAnswering || !isInProgress) return;
			doSubmit({
				variables: {
					input: {
						accountId,
						assessmentId: assessment.id,
						password,
					},
				},
				onCompleted: cb,
			});
		},
		[isSubmitting, isAnswering, isInProgress, submitButtonIsDisabled],
	);

	const contextValue: ISkillAssessmentExecutionContext = {
		submitButtonIsDisabled,
		setSubmitButtonIsDisabled,
		formik,
		answer,
		isAnswering,
		accountId,
		assessmentId,
		progress,
		navigationMode,
		isSubmitting,
		submit,
	};

	return (
		<SkillAssessmentExecutionContext.Provider value={contextValue}>
			{children}
		</SkillAssessmentExecutionContext.Provider>
	);
};
