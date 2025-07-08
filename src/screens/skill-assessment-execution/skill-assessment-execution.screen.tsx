import React from "react";
import { SkillAssessmentExecutionProps } from "./skill-assessment-execution.types";
import {
	AssessmentAndProgressWrapper,
	ModalContent,
	ModalHeaderWrapper,
	ModalWrapper,
	TitleWrapper,
	Wrapper,
} from "@screens/skill-assessment-execution/skill-assessment-execution.styles";
import { formatDate, withAssessmentLogin } from "@screens/skill-assessment/skill-assessment.util";
import { LabelSpan, PageTitleSpan, PSpan } from "@screens/skill-assessment/parts/mock/typography";
import { primary, textContrast, textSubtle } from "@screens/skill-assessment/parts/mock/color";
import { useLocation, useMatch } from "react-router-dom";
import { SKILL_ASSESSMENT_EXECUTION_PATH } from "@screens/skill-assessment-execution/skill-assessment-execution.consts";
import { CategoryForm } from "@screens/skill-assessment-execution/parts/category-form";
import { Navigation } from "@screens/skill-assessment-execution/parts/navigation";
import { SkillAssessmentTheme } from "@corestyle/component-theme/component-theme";
import { TkComponentsContext } from "@thekeytechnology/framework-react-components";
import { useLazyLoadQuery } from "react-relay";
import { QUERY } from "@screens/skill-assessment-execution/skill-assessment-execution.graphql";
import { skillAssessmentExecution_Query } from "@relay/skillAssessmentExecution_Query.graphql";
import { SkillAssessmentExecutionContextProvider } from "@screens/skill-assessment-execution/skill-assessment-execution.context";
import { NavigationMode } from "@screens/skill-assessment-execution/parts/navigation/navigation.consts";
import { AssessmentExecutionProgressBar } from "@screens/skill-assessment-execution/parts/assessment-execution-progress-bar";
import AssessmentBackground from "@assets/assessment-background.svg";

export const SkillAssessmentExecutionWithAuth = () => {
	const match = useMatch(SKILL_ASSESSMENT_EXECUTION_PATH);
	const accountId = match?.params.accountId ?? "";
	const id = match?.params.id ?? "";
	return withAssessmentLogin(
		(props) => <SkillAssessmentExecution accountId={accountId} id={id} {...props} />,
		accountId,
	);
};

const SkillAssessmentExecution = ({ accountId, id, password }: SkillAssessmentExecutionProps) => {
	const location = useLocation();
	const mode = new URLSearchParams(location.search).get("mode");
	const navigationMode = mode === "read" ? NavigationMode.read : NavigationMode.write;

	const query = useLazyLoadQuery<skillAssessmentExecution_Query>(QUERY, {
		accountId: accountId!,
		assessmentId: id!,
		password,
	});

	const today = formatDate(new Date());

	const userName = query?.Assessment.MyAssessment?.person?.name;
	const assessmentName = query?.Assessment.MyAssessment?.template?.name;
	const managerName = query?.Assessment.MyAssessment?.supervisor?.name;

	return (
		<TkComponentsContext.Provider value={SkillAssessmentTheme}>
			<SkillAssessmentExecutionContextProvider
				accountId={accountId}
				assessmentId={id ?? ""}
				skillAssessmentFragmentRef={query.Assessment.MyAssessment!}
				navigationMode={navigationMode}
				password={password}
			>
				<Wrapper backgroundImage={AssessmentBackground}>
					<ModalWrapper>
						<ModalContent>
							<ModalHeaderWrapper>
								<LabelSpan color={textSubtle}>{today}</LabelSpan>

								<AssessmentAndProgressWrapper>
									<TitleWrapper>
										<PageTitleSpan color={textContrast}>
											{userName}
										</PageTitleSpan>
										<PageTitleSpan color={primary}>
											{assessmentName}
										</PageTitleSpan>
									</TitleWrapper>
									<AssessmentExecutionProgressBar />
								</AssessmentAndProgressWrapper>
								{managerName && (
									<PSpan color={textSubtle}>With manager {managerName}</PSpan>
								)}
							</ModalHeaderWrapper>

							<CategoryForm assessmentFragmentRef={query?.Assessment.MyAssessment!} />
						</ModalContent>
					</ModalWrapper>
					{query?.Assessment.MyAssessment && (
						<Navigation
							assessmentFragmentRef={query?.Assessment.MyAssessment}
							mode={navigationMode}
						/>
					)}
				</Wrapper>
			</SkillAssessmentExecutionContextProvider>
		</TkComponentsContext.Provider>
	);
};
