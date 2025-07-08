import { graphql } from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { useState } from "react";
import { TkButton } from "../ui/TkButton";
import { LoginAsUsersControl_LoginAsUserMutation } from "../../__generated__/LoginAsUsersControl_LoginAsUserMutation.graphql";
import { JwtTokenData, LOCAL_STORAGE_LOGIN_DATA_KEY, setLoggedIn } from "../../redux/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectPermissionsInAccount } from "../../redux/CurrentUserSlice";
import { SelectUserField } from "./SelectUserField";

const LOGIN_MUTATION = graphql`
	mutation LoginAsUsersControl_LoginAsUserMutation($input: LoginAsUserJwtInput!) {
		Admin {
			Auth {
				loginAsUserJwt(input: $input) {
					jwtTokens {
						accessToken
						refreshToken
					}
				}
			}
		}
	}
`;

const BACKUP_LOCAL_STORAGE_KEY = "tkt-return-login-data";

interface OwnProps {
	className?: string;
}

export const LoginAsUsersControl = ({ className }: OwnProps) => {
	const dispatch = useDispatch();
	const permissionsInAccount = useSelector(selectPermissionsInAccount);

	const [loginAs, isLoggingInAs] =
		useMutation<LoginAsUsersControl_LoginAsUserMutation>(LOGIN_MUTATION);

	const [selectedUserId, setSelectedUserId] = useState<string | undefined>();

	let existingMemorizedLoginData: JwtTokenData | undefined = undefined;
	try {
		const storedData = localStorage.getItem(BACKUP_LOCAL_STORAGE_KEY);
		existingMemorizedLoginData = storedData ? JSON.parse(storedData) : undefined;
	} catch {}

	if (existingMemorizedLoginData) {
		return (
			<TkButton
				className={className}
				label="Back to original user"
				onClick={() => {
					localStorage.removeItem(BACKUP_LOCAL_STORAGE_KEY);
					dispatch(
						setLoggedIn({ tokenData: existingMemorizedLoginData!, redirect: "/" }),
					);
				}}
			/>
		);
	}

	if (!permissionsInAccount?.includes("AccountPermission_System_Root")) {
		return null;
	}

	return (
		<div className={className}>
			<SelectUserField
				fieldName="login-as-user"
				fieldValue={selectedUserId}
				updateField={(newValue) => setSelectedUserId(newValue)}
				placeholder={"Select user"}
			/>

			<TkButton
				disabled={!selectedUserId || isLoggingInAs}
				icon="pi pi-sign-in"
				onClick={() => {
					loginAs({
						variables: {
							input: {
								userId: selectedUserId!,
							},
						},
						onCompleted: (e) => {
							if (e.Admin.Auth.loginAsUserJwt?.jwtTokens) {
								localStorage.setItem(
									BACKUP_LOCAL_STORAGE_KEY,
									localStorage.getItem(LOCAL_STORAGE_LOGIN_DATA_KEY)!,
								);
								dispatch(
									setLoggedIn({
										tokenData: e.Admin.Auth.loginAsUserJwt.jwtTokens,
										redirect: "/",
									}),
								);
							}
						},
					});
				}}
			/>
		</div>
	);
};
