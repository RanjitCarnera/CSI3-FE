import { Form, TkComponentsContext } from "@thekeytechnology/framework-react-components";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthScreenBase } from "@components/ui/AuthScreenBase";
import { TkButton } from "@components/ui/TkButton";
import { HarkinsTheme } from "@corestyle/component-theme/component-theme";
import {
	TWO_FACTOR_AUTH_OTP_ROUTE,
	type TwoFactorAuthOtpState,
} from "@screens/two-factor-auth-otp";
import { RedirectTo } from "../../navigation/RedirectTo";

export const TWO_FACTOR_AUTH_SETUP_ROUTE = "/login/2fa/setup";
export const TwoFASetupScreen = () => {
	const location = useLocation();
	const state = location?.state as {
		qrCodeUri?: string;
		email?: string;
		password?: string;
		username?: string;
	};
	const navigate = useNavigate();

	if (!state?.qrCodeUri) return <RedirectTo to={"/login"} />;
	const handleContinueOnClick = () => {
		const email = state?.email ?? "";
		const password = state?.password ?? "";

		navigate(TWO_FACTOR_AUTH_OTP_ROUTE, {
			state: { email, password } as TwoFactorAuthOtpState,
		});
	};
	return (
		<AuthScreenBase>
			<TkComponentsContext.Provider value={HarkinsTheme}>
				<Form className={"px-6 mb-6"}>
					<h1 className="text-center mb-6 text">Setup 2FA</h1>
					<span className={"text-center text"}>
						Please scan the QR code with your authenticator app of choice.
					</span>
					<img src={state?.qrCodeUri} className={"w-full center"} />
					<span className={"text-center text"}>
						After scanning the qr code, click 'activate' to continue.
					</span>
					<TkButton
						label="Activate"
						className="p-mt-2 mt-4"
						onClick={handleContinueOnClick}
					/>
				</Form>
			</TkComponentsContext.Provider>
		</AuthScreenBase>
	);
};
