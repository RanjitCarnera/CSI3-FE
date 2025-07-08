import {
	Button,
	TkComponentsContext,
	ValidatedField,
} from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import { isArray } from "lodash";

import debounce from "lodash.debounce";
import React, { useEffect, useMemo, useState } from "react";
import { useLazyLoadQuery, useMutation, useRefetchableFragment } from "react-relay";
import { useMatch, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import AssessmentBackground from "@assets/assessment-background.svg";
import { SelectSkillAssessmentTemplates } from "@components/relay/select-skill-assessment-templates";
import { SelectUserInAccountField } from "@components/relay/select-user-in-account-field";
import { SkillAssessmentTheme } from "@corestyle/component-theme/component-theme";
import { type skillAssessment_GetLastUpdatedDateQuery$key } from "@relay/skillAssessment_GetLastUpdatedDateQuery.graphql";
import { type skillAssessment_Query } from "@relay/skillAssessment_Query.graphql";
import {
	type skillAssessment_Refetch,
	type skillAssessment_Refetch$variables,
} from "@relay/skillAssessment_Refetch.graphql";
import { type skillAssessment_StartAssessmentMutation } from "@relay/skillAssessment_StartAssessmentMutation.graphql";
import {
	primary,
	textContrast,
	textExtraSubtle,
	textSubtle,
} from "@screens/skill-assessment/parts/mock/color";
import {
	LabelSpan,
	PageTitleSpan,
	PSpan,
	TbdSpan,
} from "@screens/skill-assessment/parts/mock/typography";
import { SKILL_ASSESSMENT_PATH } from "@screens/skill-assessment/skill-assessment.consts";
import {
	QUERY,
	QUERY_FRAGMENT,
	START_ASSESSMENT_MUTATION,
} from "@screens/skill-assessment/skill-assessment.graphql";
import {
	FlexColChild1,
	FlexColChild2,
	FlexColWith2Gap,
	ModalHeader,
	ModalWrapper,
	PageTitleWrapper,
	Wrapper,
} from "@screens/skill-assessment/skill-assessment.styles";
import { formatDate, withAssessmentLogin } from "@screens/skill-assessment/skill-assessment.util";
import { SKILL_ASSESSMENT_EXECUTION_PATH_WITH_ID } from "@screens/skill-assessment-execution/skill-assessment-execution.consts";
import { APP_NAME } from "@utils/consts";
import { type SkillAssessmentFormState } from "./skill-assessment.types";

export const SkillAssessmentWithAuth = () => {
	const match = useMatch(SKILL_ASSESSMENT_PATH);
	const accountId = match?.params.accountId ?? "";
	return withAssessmentLogin(
		(props) => <SkillAssessment accountId={accountId} {...props} />,
		accountId,
	);
};

const SkillAssessment = ({ accountId, password }: { accountId: string; password?: string }) => {
	const query = useLazyLoadQuery<skillAssessment_Query>(QUERY, { accountId, password });
	const [
		{
			Assessment: { GetContinueFromDate: lastUpdatedDate },
		},
		refetch,
	] = useRefetchableFragment<
		skillAssessment_Refetch,
		skillAssessment_GetLastUpdatedDateQuery$key
	>(QUERY_FRAGMENT, query);

	const [initialLoad, setInitialLoadComplete] = useState(true);

	const debouncedRefetch = ({
		personId,
		templateId,
		accountId,
	}: skillAssessment_Refetch$variables) => {
		refetch(
			{ accountId, personId, templateId },
			{
				fetchPolicy: "network-only",
			},
		);
	};

	const debouncedEventHandler = useMemo(
		() => {
			const cb = (filters: skillAssessment_Refetch$variables) => {
				debouncedRefetch(filters);
			};
			return debounce(cb, 300);
		},
		// eslint-disable-next-line
		[],
	);

	const todayIsText = `Today is ${formatDate(new Date())}`;
	const continueOnAssessmentText = useMemo(
		() =>
			lastUpdatedDate
				? `Continue ${formatDate(new Date(lastUpdatedDate.slice(0, -5)))} assessment`
				: "",
		[lastUpdatedDate],
	);
	const [start, isStarting] =
		useMutation<skillAssessment_StartAssessmentMutation>(START_ASSESSMENT_MUTATION);

	const logo = (
		<div style={{ height: "3rem" }}>
			{query.Assessment.AccountLogo?.url && (
				<img
					style={{
						height: "auto",
						maxWidth: "7.8rem",
						maxHeight: "100%",
					}}
					src={query.Assessment.AccountLogo.url}
				/>
			)}
		</div>
	);
	const navigate = useNavigate();

	const formik = useFormik<SkillAssessmentFormState>({
		initialValues: {
			assessment: undefined,
			employee: undefined,
			manager: undefined,
		},
		validationSchema: Yup.object().shape({
			assessment: Yup.string().required(),
			manager: Yup.string().optional().nullable(),
			employee: Yup.string().required(),
		}),
		onSubmit: (values) => {
			start({
				variables: {
					input: {
						accountId,
						personId: values.employee!,
						supervisorId: values.manager,
						templateId: values.assessment!,
					},
				},
				onCompleted: (response) => {
					navigate(
						SKILL_ASSESSMENT_EXECUTION_PATH_WITH_ID(
							accountId,
							response.Assessment.startAssessment?.assessment.id ?? "",
						),
					);
				},
				onError: () => {
					toast.error("An error occured.");
				},
			});
		},
	});

	useEffect(() => {
		if (initialLoad) {
			setInitialLoadComplete(false);
		} else if (formik.values.employee && formik.values.assessment) {
			debouncedEventHandler({
				accountId,
				personId: formik.values.employee,
				templateId: formik.values.assessment,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values]);

	const isEmpty = Object.values(formik.values).every((e) => isArray(e) || e === undefined);
	const handleOnClick = () => {
		formik.handleSubmit();
	};
	return (
		<TkComponentsContext.Provider value={SkillAssessmentTheme}>
			<Wrapper backgroundImage={AssessmentBackground}>
				<ModalWrapper>
					<FlexColChild1>
						<ModalHeader>
							{logo} <PSpan color={textExtraSubtle}>{todayIsText}</PSpan>
						</ModalHeader>
						<PageTitleWrapper>
							<PageTitleSpan color={textContrast}>Welcome to </PageTitleSpan>
							<PageTitleSpan color={primary}>Skill Assessments</PageTitleSpan>
							<PageTitleSpan color={textContrast}>in {APP_NAME}</PageTitleSpan>
						</PageTitleWrapper>

						<PSpan color={textSubtle}>
							To get started select the employee, their job title, and the manager.
							Or, you can search for a partially completed assessment.
						</PSpan>
					</FlexColChild1>
					<FlexColWith2Gap>
						<FlexColChild2>
							<LabelSpan color={textSubtle}>Employee</LabelSpan>
							<ValidatedField<SkillAssessmentFormState, string>
								name={"employee"}
								formikConfig={formik}
								component={(renderConfig) => (
									<SelectUserInAccountField
										{...renderConfig}
										accountId={accountId}
										placeholder={"Employee"}
									/>
								)}
							/>

							<ValidatedField<SkillAssessmentFormState, string>
								name={"assessment"}
								formikConfig={formik}
								component={(renderConfig) => (
									<SelectSkillAssessmentTemplates
										{...renderConfig}
										accountId={accountId}
										placeholder={"Assessment"}
									/>
								)}
							/>

							<TbdSpan color={primary}>{continueOnAssessmentText}</TbdSpan>
						</FlexColChild2>
						<FlexColChild2>
							<LabelSpan color={textSubtle}>Manager</LabelSpan>

							<ValidatedField<SkillAssessmentFormState, string>
								name={"manager"}
								formikConfig={formik}
								component={(renderConfig) => (
									<SelectUserInAccountField
										{...renderConfig}
										accountId={accountId}
										placeholder={"Manager"}
										emptyMessage={"No supervisor"}
										first={100}
									/>
								)}
							/>
						</FlexColChild2>
					</FlexColWith2Gap>

					<Button
						disabled={isEmpty || isStarting || !formik.isValid}
						content={{ label: "Start new assessment" }}
						onClick={handleOnClick}
					/>
				</ModalWrapper>
			</Wrapper>
		</TkComponentsContext.Provider>
	);
};
