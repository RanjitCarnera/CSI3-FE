import React, { useContext } from "react";
import { NavigationProps } from "./navigation.types";
import {
	ButtonWrapper,
	ContentWrapper,
	Wrapper,
} from "@screens/skill-assessment-execution/parts/navigation/navigation.styles";
import { Button } from "@thekeytechnology/framework-react-components";
import { SkillAssessmentExecutionContext } from "@screens/skill-assessment-execution/skill-assessment-execution.context";
import { useMatch, useNavigate } from "react-router-dom";

import { SKILL_ASSESSMENT_SUCCESS_PATH_WITH_ID } from "@screens/skill-assessment-success/skill-assessment-success.consts";
import { SKILL_ASSESSMENT_EXECUTION_PATH } from "@screens/skill-assessment-execution/skill-assessment-execution.consts";
import { NavigationMode } from "@screens/skill-assessment-execution/parts/navigation/navigation.consts";
import { useFragment } from "react-relay";
import { ASSESSMENT_FRAGMENT } from "@screens/skill-assessment-execution/parts/navigation/navigation.graphql";
import { navigation_AssessmentFragment$key } from "@relay/navigation_AssessmentFragment.graphql";
import { toast } from "react-toastify";

export const Navigation = ({ mode, assessmentFragmentRef }: NavigationProps) => {
	const match = useMatch(SKILL_ASSESSMENT_EXECUTION_PATH);
	const assessmentId = match?.params.id;
	const { submitButtonIsDisabled, accountId, submit, isSubmitting } = useContext(
		SkillAssessmentExecutionContext,
	);
	const navigate = useNavigate();

	const assessment = useFragment<navigation_AssessmentFragment$key>(
		ASSESSMENT_FRAGMENT,
		assessmentFragmentRef,
	);

	const handleSubmitOnClick = () => {
		submit?.(() => {
			navigate(SKILL_ASSESSMENT_SUCCESS_PATH_WITH_ID(accountId, assessmentId ?? ""));
		});
	};
	const handleDownloadOnClick = () => {
		if (assessment?.status?.kind !== "PdfGenerated")
			return toast.error("Could not download pdf.");
		if (!assessment.status.file?.url) return toast.error("Could not download pdf.");

		const link = document.createElement("a");
		link.target = "_blank";
		link.download = assessment.status.file.name;
		link.href = assessment.status.file.url;
		link.click();
	};
	const label = isSubmitting ? "Submitting..." : "Submit";

	if (mode === NavigationMode.write) {
		return (
			<Wrapper>
				<ContentWrapper>
					<ButtonWrapper />
					<ButtonWrapper>
						<Button
							disabled={submitButtonIsDisabled}
							content={{ label }}
							inputVariant={"solid"}
							onClick={handleSubmitOnClick}
						/>
					</ButtonWrapper>
				</ContentWrapper>
			</Wrapper>
		);
	}
	return (
		<Wrapper>
			<ContentWrapper>
				<ButtonWrapper>
					<Button
						content={{ label: "Download" }}
						inputVariant={"solid"}
						onClick={handleDownloadOnClick}
					/>
				</ButtonWrapper>
			</ContentWrapper>
		</Wrapper>
	);
};
