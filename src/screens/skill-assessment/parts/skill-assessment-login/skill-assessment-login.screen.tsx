import { Button, TkComponentsContext } from "@thekeytechnology/framework-react-components";
import { Password } from "primereact/password";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { toast } from "react-toastify";
import { SkillAssessmentTheme } from "@corestyle/component-theme/component-theme";
import { type skillAssessmentLogin_LoginToAssessmentMutation } from "@relay/skillAssessmentLogin_LoginToAssessmentMutation.graphql";
import { type skillAssessmentLogin_Query } from "@relay/skillAssessmentLogin_Query.graphql";
import {
	primary,
	textContrast,
	textExtraSubtle,
	textSubtle,
} from "@screens/skill-assessment/parts/mock/color";
import { PageTitleSpan, PSpan } from "@screens/skill-assessment/parts/mock/typography";
import {
	LOGIN_TO_ASSESSMENT_MUTATION,
	QUERY,
} from "@screens/skill-assessment/parts/skill-assessment-login/skill-assessment-login.graphql";
import {
	InputWrapper,
	Spacing2,
} from "@screens/skill-assessment/parts/skill-assessment-login/skill-assessment-login.styles";
import { type SkillAssessmentLoginProps } from "@screens/skill-assessment/parts/skill-assessment-login/skill-assessment-login.types";
import { getCookieName } from "@screens/skill-assessment/parts/skill-assessment-login/skill-assessment-login.util";
import {
	FlexColChild1,
	ModalHeader,
	ModalWrapper,
	PageTitleWrapper,
	Wrapper,
} from "@screens/skill-assessment/skill-assessment.styles";
import { APP_NAME } from "@utils/consts";

export const Login = ({ accountId }: SkillAssessmentLoginProps) => {
	const [_, setCookies] = useCookies([getCookieName(accountId)]);
	const query = useLazyLoadQuery<skillAssessmentLogin_Query>(QUERY, { accountId });
	const [login, isLogging] = useMutation<skillAssessmentLogin_LoginToAssessmentMutation>(
		LOGIN_TO_ASSESSMENT_MUTATION,
	);
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

	const [password, setPassword] = useState<string | undefined>("");
	const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		setPassword(e.currentTarget.value);
	};
	const handleOnSubmit = () => {
		// dispatch mutation
		if (!password) return;
		login({
			variables: {
				input: {
					accountId,
					password,
				},
			},
			onCompleted: (response) => {
				const {
					Assessment: { loginToAssessment },
				} = response;
				if (loginToAssessment?.password) {
					setCookies(getCookieName(accountId), loginToAssessment.password, {
						path: "/",
					});
				} else {
					toast.error("Invalid password.");
				}
			},
		});
	};
	return (
		<TkComponentsContext.Provider value={SkillAssessmentTheme}>
			<Wrapper>
				<ModalWrapper>
					<FlexColChild1>
						<ModalHeader>
							{logo} <PSpan color={textExtraSubtle}></PSpan>
						</ModalHeader>
						<PageTitleWrapper>
							<PageTitleSpan color={textContrast}>Welcome to </PageTitleSpan>
							<PageTitleSpan color={primary}>Skill Assessments</PageTitleSpan>
							<PageTitleSpan color={textContrast}>in {APP_NAME}</PageTitleSpan>
						</PageTitleWrapper>
						<Spacing2 />
						<PSpan color={textSubtle}>
							To get started, please login. You may need ot ask your supervisor for a
							password.
						</PSpan>
						<InputWrapper>
							<Password
								value={password}
								onChange={handleOnChange}
								toggleMask
								feedback={false}
								placeholder={"password"}
							/>
						</InputWrapper>
						<Spacing2 />
						<Button
							content={{ label: isLogging ? "Submitting..." : "Submit" }}
							disabled={isLogging}
							onClick={handleOnSubmit}
						/>
					</FlexColChild1>
				</ModalWrapper>
			</Wrapper>
		</TkComponentsContext.Provider>
	);
};
