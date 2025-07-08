import { SpinnerIcon } from "primereact/icons/spinner";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useMutation } from "react-relay";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthScreenBase } from "@components/ui/AuthScreenBase";
import { setLoggedIn } from "@redux/AuthSlice";
import { type loginForm_LoginAzureAdUserMutation } from "@relay/loginForm_LoginAzureAdUserMutation.graphql";
import { LOGIN_AZURE_AD_USER_MUTATION } from "@screens/login/parts/login-form/login-form.graphql";
import { Wrapper } from "./login-azure-ad-redirect.styles";

export const LoginAzureAdRedirect = () => {
	const [searchParams] = useSearchParams();
	const code = searchParams.get("code");
	const state = searchParams.get("state");
	const error = searchParams.get("error");
	const errorMessage = searchParams.get("error_description");
	const dispatch = useDispatch();
	const [authorize, isAuthing] = useMutation<loginForm_LoginAzureAdUserMutation>(
		LOGIN_AZURE_AD_USER_MUTATION,
	);
	const navigate = useNavigate();
	useEffect(() => {
		if (!code) return;
		if (!state) return;
		const parsedState = parseState(state);

		authorize({
			variables: {
				input: {
					code: code!,
					email: parsedState.email,
					codeVerifier: parsedState.codeVerifier!,
				},
			},
			onCompleted: (res) => {
				const tokenData = res.Sso.loginAzureAdUserWithHarkinsUserExtension?.jwtTokens;
				if (!tokenData) return;
				dispatch(
					setLoggedIn({
						tokenData,
					}),
				);
			},
			onError: (res) => {
				toast.error("An Error Occurred. Please consult your account admin.");
				setTimeout(() => {
					navigate("/");
				}, 5000);
			},
		});
	}, []);

	useEffect(() => {
		if (!error) return;
		toast.error(`An Error Occurred. Please consult your account admin. MSG: ${errorMessage}`);
		setTimeout(() => {
			navigate("/");
		}, 5000);
	}, [error]);

	return (
		<AuthScreenBase>
			{isAuthing && (
				<Wrapper>
					<SpinnerIcon />
					<h3>Logging in...</h3>
				</Wrapper>
			)}
		</AuthScreenBase>
	);
};

const parseState = (state: string): { codeVerifier: string; email: string } => {
	const decoded = atob(decodeURIComponent(state!));
	return JSON.parse(decoded);
};
