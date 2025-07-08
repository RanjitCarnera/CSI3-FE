import { Button, TkComponentsContext } from "@thekeytechnology/framework-react-components";
import React from "react";
import { useLazyLoadQuery } from "react-relay";
import { createSearchParams, useMatch } from "react-router-dom";
import {withAssessmentLogin} from "@screens/skill-assessment/skill-assessment.util";
import {SkillAssessmentSuccessProps} from "@screens/skill-assessment-success/skill-assessment-success.types";
import AssessmentBackground from "@assets/assessment-background.svg";
import {SkillAssessmentTheme} from "@corestyle/component-theme/component-theme";
import {skillAssessmentSuccess_AssessmentNodeQuery} from "@relay/skillAssessmentSuccess_AssessmentNodeQuery.graphql";
import { primary, textContrast, textSubtle } from "@screens/skill-assessment/parts/mock/color";
import { PageTitleSpan, PSpan } from "@screens/skill-assessment/parts/mock/typography";
import {NavigationMode} from "@screens/skill-assessment-execution/parts/navigation/navigation.consts";
import { SKILL_ASSESSMENT_EXECUTION_PATH_WITH_ID } from "@screens/skill-assessment-execution/skill-assessment-execution.consts";
import { SKILL_ASSESSMENT_SUCCESS_PATH } from "@screens/skill-assessment-success/skill-assessment-success.consts";
import { QUERY } from "@screens/skill-assessment-success/skill-assessment-success.graphql";
import {
	ContentWrapper,
	ModalWrapper,
	Wrapper,
} from "@screens/skill-assessment-success/skill-assessment-success.styles";
import { ReactComponent as RibbonCoin } from "../../assets/ribbon-coin.svg";

export const SkillAssessmentSuccessWithAuth = () => {
	const match = useMatch(SKILL_ASSESSMENT_SUCCESS_PATH);
	const accountId = match?.params.accountId ?? "";
	const assessmentId = match?.params.id ?? "";
	return withAssessmentLogin(
		(props) => (
			<SkillAssessmentSuccess accountId={accountId} assessmentId={assessmentId} {...props} />
		),
		accountId,
	);
};

const SkillAssessmentSuccess = ({
	accountId,
	assessmentId,
	password,
}: SkillAssessmentSuccessProps) => {
	const query = useLazyLoadQuery<skillAssessmentSuccess_AssessmentNodeQuery>(QUERY, {
		accountId: accountId!,
		id: assessmentId,
		password,
	});

	const userName = query.Assessment.MyAssessment?.person?.name ?? "";
	const assessmentName = query.Assessment.MyAssessment?.template?.name ?? "";
	const handleOnClick = () => {
		const params = { mode: NavigationMode.read };
		window.open(
			`${SKILL_ASSESSMENT_EXECUTION_PATH_WITH_ID(
				accountId,
				assessmentId,
			)}?${createSearchParams(params)}`,
			"_blank",
		);
	};
	return (
		<TkComponentsContext.Provider value={SkillAssessmentTheme}>
			<Wrapper backgroundImage={AssessmentBackground}>
				<ModalWrapper>
					<ContentWrapper>
						<RibbonCoin />
						<div>
							<PageTitleSpan color={textContrast}>{userName}’</PageTitleSpan> <br />
							<PageTitleSpan color={primary}>{assessmentName}</PageTitleSpan>
						</div>
						<PSpan color={textSubtle}>
							Nice work! You’ve successfully finished this. You’re all done. If you’d
							like, you can view the final assessment to save or print.
						</PSpan>
					</ContentWrapper>
					<Button content={{ label: "View assessment" }} onClick={handleOnClick} />
				</ModalWrapper>
			</Wrapper>
		</TkComponentsContext.Provider>
	);
};
