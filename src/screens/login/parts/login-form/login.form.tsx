import { Form } from "@thekeytechnology/framework-react-components";
import { useFormik } from "formik";
import debounce from "lodash.debounce";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "react-relay";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { match } from "ts-pattern";
import * as Yup from "yup";
import { TkButton } from "@components/ui/TkButton";
import { TkButtonLink } from "@components/ui/TkButtonLink";
import { ValidatedField } from "@components/ui/ValidatedField";
import { setLoggedIn } from "@redux/AuthSlice";
import { type loginForm_EmailHasAzureADSSOSetupMutation } from "@relay/loginForm_EmailHasAzureADSSOSetupMutation.graphql";
import { type loginForm_GetAzureAdAuthenticationUrlForEmailMutation } from "@relay/loginForm_GetAzureAdAuthenticationUrlForEmailMutation.graphql";
import { type loginForm_LoginAzureAdUserMutation } from "@relay/loginForm_LoginAzureAdUserMutation.graphql";
import {
	type loginForm_LoginMutation,
	type loginForm_LoginMutation$data,
} from "@relay/loginForm_LoginMutation.graphql";
import {
	EMAIL_HAS_AZURE_AD_SSO_SETUP_MUTATION,
	GET_AZURE_AD_AUTHENTICATION_URL_FOR_EMAIL,
	LOGIN_AZURE_AD_USER_MUTATION,
	LOGIN_MUTATION,
} from "@screens/login/parts/login-form/login-form.graphql";
import { type LoginFormState } from "@screens/login/parts/login-form/login-form.types";
import {
	generatePKCEChallengeAndVerifier,
	patchStateParamInRedirectUrl,
} from "@screens/login/parts/login-form/login-form.utils";
import {
	TWO_FACTOR_AUTH_OTP_ROUTE,
	type TwoFactorAuthOtpState,
} from "@screens/two-factor-auth-otp";
import { TWO_FACTOR_AUTH_SETUP_ROUTE } from "@screens/two-factor-auth-setup";

export const LoginForm = () => {
	const dispatch = useDispatch();
	const [authenticate] = useMutation<loginForm_GetAzureAdAuthenticationUrlForEmailMutation>(
		GET_AZURE_AD_AUTHENTICATION_URL_FOR_EMAIL,
	);
	const [login, isLoggingIn] = useMutation<loginForm_LoginMutation>(LOGIN_MUTATION);
	const [hasAzureAdSsoSetup, setHasAzureAdSsoSetup] = useState(false);
	const [getAddAzureADSSOSetup, _] = useMutation<loginForm_EmailHasAzureADSSOSetupMutation>(
		EMAIL_HAS_AZURE_AD_SSO_SETUP_MUTATION,
	);
	const passwordIsRequired = useMemo(() => !hasAzureAdSsoSetup, [hasAzureAdSsoSetup]);

	const [loginAzureAdSso] = useMutation<loginForm_LoginAzureAdUserMutation>(
		LOGIN_AZURE_AD_USER_MUTATION,
	);
	const navigate = useNavigate();

	const handleLoginJWT = (response: loginForm_LoginMutation$data) => {
		const tokenData = response.Auth.loginJwt?.status.jwtTokens;
		if (!tokenData) return;
		dispatch(
			setLoggedIn({
				tokenData,
			}),
		);
	};
	const handleRedirect2FALogin = (response: loginForm_LoginMutation$data) => {
		const email = response.Auth.loginJwt?.status.email ?? "";
		const password = response.Auth.loginJwt?.status.password ?? "";

		navigate(TWO_FACTOR_AUTH_OTP_ROUTE, {
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			state: { email, password } as TwoFactorAuthOtpState,
		});
	};

	const handleRedirect2FASetup = (response: loginForm_LoginMutation$data) => {
		const email = response.Auth.loginJwt?.status.email ?? "";
		const password = response.Auth.loginJwt?.status.password ?? "";
		navigate(
			TWO_FACTOR_AUTH_SETUP_ROUTE.replace(":email", email).replace(":password", password),
			{
				state: {
					qrCodeUri: response.Auth.loginJwt?.status.qrCodeUri,
					password,
					email,
				},
			},
		);
	};

	const passwordValidationBase = Yup.string().min(8, "A password needs at least 8 characters.");
	const passwordValidation = passwordIsRequired
		? passwordValidationBase.required("Password is a required field.")
		: passwordValidationBase.optional();
	const formik = useFormik<LoginFormState>({
		initialValues: {
			email: "",
			password: "",
		},
		enableReinitialize: true,
		validationSchema: Yup.object().shape({
			email: Yup.string()
				.email("Please enter a valid e-mail address.")
				.required("E-Mail is a required field."),
			password: passwordValidation,
		}),
		onSubmit: async (data) => {
			if (hasAzureAdSsoSetup) {
				await authenticateWithAzureAd();
				return;
			}

			login({
				variables: {
					input: {
						email: data.email,
						password: data.password,
					},
				},
				onCompleted: (response) => {
					match(response.Auth.loginJwt?.status.kind)
						.with("TwoFactorAuthRequired", () => {
							handleRedirect2FASetup(response);
						})
						.with("TwoFactorAuthCredentialsIncorrect", () => {
							handleRedirect2FALogin(response);
						})
						.with("AuthCredentialsCorrect", () => {
							handleLoginJWT(response);
						});
				},
			});
		},
	});

	const sendRequest = useCallback((value?: string) => {
		if (!value) {
			setHasAzureAdSsoSetup(false);
			return;
		}
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		const isCorrectEmail = emailRegex.test(value);
		if (!isCorrectEmail) return;

		getAddAzureADSSOSetup({
			variables: {
				input: {
					email: value,
				},
			},
			onCompleted: (response) => {
				setHasAzureAdSsoSetup(
					response.AuthAzureAd.emailHasAzureAdSsoSetup?.hasSetup ?? false,
				);
			},
		});
	}, []);

	const debouncedSendRequest = useMemo(() => {
		return debounce(sendRequest, 1000);
	}, [sendRequest]);

	const authenticateWithAzureAd = async () => {
		const pkce = await generatePKCEChallengeAndVerifier();
		authenticate({
			variables: {
				input: {
					email: formik.values.email,
					codeChallenge: pkce.code_challenge,
				},
			},
			onCompleted: (res) => {
				if (!res.AuthAzureAd.getAzureAdAuthenticationUrlForEmail?.redirectUri) {
					return;
				}
				const redirectUri = patchStateParamInRedirectUrl(
					res.AuthAzureAd.getAzureAdAuthenticationUrlForEmail.redirectUri,
					pkce.code_verifier,
				);

				window.location.href = redirectUri;
			},
			onError: () => {
				toast.error("An Error Occurred. Please consult your account admin.");
			},
		});
	};

	const shouldShowLoginWithPasswordButton = useMemo(() => {
		if (hasAzureAdSsoSetup) return true;
	}, [hasAzureAdSsoSetup]);

	return (
		<Form onSubmit={formik.handleSubmit} className={"px-6 mb-6"}>
			<ValidatedField<LoginFormState, string>
				className="mb-4"
				name={"email"}
				label={"E-Mail"}
				required={true}
				formikConfig={formik}
				component={({ fieldValue, updateField, fieldName, isValid }) => {
					return (
						<InputText
							id={fieldName}
							name={fieldName}
							value={fieldValue}
							onChange={(e) => {
								updateField(e.target.value);
								debouncedSendRequest(e.target.value);
							}}
							className={classNames({ "p-invalid": !isValid })}
						/>
					);
				}}
			/>
			<div
				style={{
					transition: "max-height 0.5s ease-in-out",
					overflow: "hidden",
					...(hasAzureAdSsoSetup ? { maxHeight: 0 } : { maxHeight: "500px" }),
				}}
			>
				<ValidatedField<LoginFormState, string>
					className="mb-6"
					name={"password"}
					label={"Password"}
					required={passwordIsRequired}
					formikConfig={formik}
					component={({ fieldValue, updateField, fieldName, isValid }) => {
						return (
							<Password
								id={fieldName}
								name={fieldName}
								value={fieldValue}
								onChange={(e) => {
									updateField(e.target.value);
								}}
								toggleMask
								feedback={false}
								className={classNames({ "p-invalid": !isValid })}
							/>
						);
					}}
				/>
			</div>

			<TkButton
				disabled={isLoggingIn}
				type="submit"
				label={shouldShowLoginWithPasswordButton ? "Continue With Azure Ad" : "Sign In"}
				className="p-mt-2"
			/>
			<div className="mt-5">
				<NavLink to={"/forgot-password"}>
					<TkButtonLink label={"I forgot my password..."} />
				</NavLink>
			</div>
		</Form>
	);
};
