import { Form, TkComponentsContext } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "react-relay";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthScreenBase } from "@components/ui/AuthScreenBase";
import { DefaultOTPFieldComponent } from "@components/ui/DefaultTextInput";
import { TkButton } from "@components/ui/TkButton";
import { TkButtonLink } from "@components/ui/TkButtonLink";
import { ValidatedField, type ValidatedFieldConfig } from "@components/ui/ValidatedField";
import { HarkinsTheme } from "@corestyle/component-theme/component-theme";
import { setLoggedIn } from "@redux/AuthSlice";
import { type twoFactorAuthOtp_login2FAMutation } from "@relay/twoFactorAuthOtp_login2FAMutation.graphql";
import { LOGIN_2FA_MUTATION } from "@screens/two-factor-auth-otp/two-factor-auth-otp.graphql";
import {
	TWO_FACTOR_AUTH_RECOVERY_ROUTE,
	type TwoFactorAuthRecoveryScreenState,
} from "@screens/two-factor-auth-recovery";
import { RedirectTo } from "../../navigation/RedirectTo";

export const TWO_FACTOR_AUTH_OTP_ROUTE = "/login/2fa";
export interface TwoFactorAuthOtpState {
	email?: string;
	password: string;
}
export const TwoFactorAuthOtpScreen = () => {
	const location = useLocation();
	const state = location.state as TwoFactorAuthOtpState;
	const [validate] = useMutation<twoFactorAuthOtp_login2FAMutation>(LOGIN_2FA_MUTATION);
	interface FormState {
		otp: string;
	}
	const navigate = useNavigate();
	const dispatch = useDispatch();
	if (!state?.email || !state?.password) return <RedirectTo to={"/login"} />;

	const formik = useFormik<FormState>({
		initialValues: {
			otp: "",
		},
		onSubmit: (values) => {
			validate({
				variables: {
					input: {
						password: state?.password!,
						email: state?.email!,
						challenge: values.otp,
					},
				},
				onCompleted: (response) => {
					if (!response.Auth.login2FA?.jwtTokens) return;
					dispatch(
						setLoggedIn({
							tokenData: response.Auth.login2FA.jwtTokens,
						}),
					);
				},
			});
		},
	});
	const handleRecoverOnClick = () => {
		navigate(TWO_FACTOR_AUTH_RECOVERY_ROUTE, {
			state: { email: state?.email } as TwoFactorAuthRecoveryScreenState,
		});
	};
	return (
		<AuthScreenBase>
			<TkComponentsContext.Provider value={HarkinsTheme}>
				<div>
					<h1 className="text-center mb-6 text">One Time Password</h1>
					<Form onSubmit={formik.handleSubmit} className={"px-6 mb-6"}>
						<ValidatedField
							formikConfig={formik}
							label={"Check authenticator app for password."}
							component={(renderConfig: ValidatedFieldConfig<string>) => (
								<DefaultOTPFieldComponent
									length={6}
									{...renderConfig}
									onComplete={(challenge) => {
										void formik.setFieldValue("otp", challenge);
										formik.handleSubmit();
									}}
								/>
							)}
							name={"otp"}
						/>
						<TkButton
							className="p-mt-2"
							type={"submit"}
							label={"Submit"}
							onSubmit={() => {
								formik.handleSubmit();
							}}
						/>
						<TkButtonLink
							label={"Recover..."}
							onClick={handleRecoverOnClick}
							className="p-mt-2"
						/>
					</Form>
				</div>
			</TkComponentsContext.Provider>
		</AuthScreenBase>
	);
};
