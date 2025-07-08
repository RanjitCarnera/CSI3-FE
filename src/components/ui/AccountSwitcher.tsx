import { graphql } from "babel-plugin-relay/macro";
import { Dropdown } from "primereact/dropdown";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-relay";
import { type AccountSwitcher_SwitchAccountMutation } from "../../__generated__/AccountSwitcher_SwitchAccountMutation.graphql";
import { selectCurrentAccountId, selectLoginData, setLoggedIn } from "../../redux/AuthSlice";
import {
	selectAccountMetaNameByBase64DecodedAccountId,
	selectCurrentUser,
} from "../../redux/CurrentUserSlice";

const MUTATION = graphql`
	mutation AccountSwitcher_SwitchAccountMutation($input: SwitchAccountInput!) {
		Auth {
			switchAccount(input: $input) {
				jwtTokens {
					refreshToken
					accessToken
				}
			}
		}
	}
`;

interface OwnProps {
	className?: string;
}

export const AccountSwitcher = ({ className }: OwnProps) => {
	const [switchAccount, isSwitching] =
		useMutation<AccountSwitcher_SwitchAccountMutation>(MUTATION);
	const dispatch = useDispatch();
	const currentAccountId = useSelector(selectCurrentAccountId);
	const loginDate = useSelector(selectLoginData);
	const currentUserData = useSelector(selectCurrentUser);
	const getCurrentAccountName = useSelector(selectAccountMetaNameByBase64DecodedAccountId);

	if (!currentUserData || currentUserData.accounts.length <= 1) {
		return null;
	}

	return (
		<Dropdown
			className={className}
			placeholder={currentAccountId ? getCurrentAccountName(currentAccountId) : "Switch User"}
			disabled={isSwitching}
			name={"login-as-user"}
			value={currentAccountId}
			options={currentUserData.accounts.map((a) => {
				return {
					label: a.name,
					value: a.id,
				};
			})}
			onChange={(e) => {
				if (e.value) {
					switchAccount({
						variables: {
							input: {
								targetAccount: e.value,
								refreshToken: loginDate!.refreshToken,
							},
						},
						onCompleted: (result) => {
							dispatch(
								setLoggedIn({ tokenData: result.Auth.switchAccount?.jwtTokens! }),
							);
						},
					});
				}
			}}
		/>
	);
};
