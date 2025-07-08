import {
	DefaultTextFieldComponent,
	Form,
	TkComponentsContext,
} from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "react-relay";
import { useLocation, useNavigate } from "react-router-dom";
import { match } from "ts-pattern";
import { AuthScreenBase } from "@components/ui/AuthScreenBase";
import { TkButton } from "@components/ui/TkButton";
import { ValidatedField, type ValidatedFieldConfig } from "@components/ui/ValidatedField";
import { HarkinsTheme } from "@corestyle/component-theme/component-theme";
import { type JwtTokenData, setLoggedIn } from "@redux/AuthSlice";
import { type twoFactorAuthRecovery_TwoFactorAuthRecoveryMutation } from "@relay/twoFactorAuthRecovery_TwoFactorAuthRecoveryMutation.graphql";
import { TWO_FACTOR_AUTH_RECOVERY_MUTATION } from "@screens/two-factor-auth-recovery/two-factor-auth-recovery.graphql";
import { RedirectTo } from "../../navigation/RedirectTo";

export interface TwoFactorAuthRecoveryScreenState {
	email?: string;
}
export const TWO_FACTOR_AUTH_RECOVERY_ROUTE = "/login/2fa/recover";
export const TwoFactorAuthRecoveryScreen = () => {
	const location = useLocation();
	const state = location?.state as TwoFactorAuthRecoveryScreenState;
	const navigate = useNavigate();
	const [validate] = useMutation<twoFactorAuthRecovery_TwoFactorAuthRecoveryMutation>(
		TWO_FACTOR_AUTH_RECOVERY_MUTATION,
	);
	interface FormState {
		recoveryCode: string;
	}

	const dispatch = useDispatch();
	if (!state?.email) return <RedirectTo to={"/login"} />;
	const formik = useFormik<FormState>({
		initialValues: {
			recoveryCode: "",
		},
		onSubmit: (values) => {
			validate({
				variables: {
					input: {
						email: state.email!,
						recoverCode: values.recoveryCode!,
					},
				},
				onCompleted: (response) => {
					match(response.Auth.login2FARecoveryCode?.status.kind).with(
						"AuthCredentialsCorrect",
						() => {
							dispatch(
								setLoggedIn({
									tokenData: response.Auth.login2FARecoveryCode?.status
										?.jwtTokens as JwtTokenData,
									redirect: "/",
								}),
							);
						},
					);
				},
			});
		},
	});
	return (
		<AuthScreenBase>
			<TkComponentsContext.Provider value={HarkinsTheme}>
				<div>
					<h1 className="text-center mb-6 text">Recover 2FA!</h1>
					<Form onSubmit={formik.handleSubmit} className={"px-6 mb-6"}>
						<ValidatedField
							formikConfig={formik}
							label={"Recovery Code"}
							component={(renderConfig: ValidatedFieldConfig<string>) => (
								<DefaultTextFieldComponent {...renderConfig} />
							)}
							name={"recoveryCode"}
						/>
						<span>
							Once you use a recovery code from when you setup 2FA, it will be deleted
							and cannot be used again.
						</span>
						<TkButton type="submit" label="Submit" className="p-mt-2" />
					</Form>
				</div>
			</TkComponentsContext.Provider>
		</AuthScreenBase>
	);
};
