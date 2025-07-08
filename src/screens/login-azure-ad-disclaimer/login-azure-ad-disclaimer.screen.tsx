import { Button, Form, TkComponentsContext } from "@thekeytechnology/framework-react-components";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthScreenBase } from "@components/ui/AuthScreenBase";
import { HarkinsTheme } from "@corestyle/component-theme/component-theme";
import { APP_NAME } from "@utils/consts";

export const LoginAzureAdDisclaimer = () => {
	const accountName = "account-name";
	const navigate = useNavigate();
	const handleOnClick = () => {
		navigate("/login");
	};
	return (
		<AuthScreenBase>
			<TkComponentsContext.Provider value={HarkinsTheme}>
				<div>
					<h1 className="text-center mb-6 text">Invited Via Azure AD Single-Sign-On!</h1>
					<Form className={"px-6 mb-6 gap-6"}>
						<div>
							<strong>Disclaimer</strong>: You've been invited to join account
							{" " + accountName} via Azure AD SSO, on {APP_NAME}.
						</div>
						<ol>
							<li>Click on "Continue" below.</li>
							<li>Enter the email address to which the invitation was sent.</li>
							<li>
								Once the form requesting your password has vanished, click on
								"Continue with Azure AD".
							</li>
						</ol>
						<Button onClick={handleOnClick} content={{ label: "Continue" }} />
					</Form>
				</div>
			</TkComponentsContext.Provider>
		</AuthScreenBase>
	);
};
