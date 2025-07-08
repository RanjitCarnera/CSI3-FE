import { authMiddleware } from "react-relay-network-modern";
import { ReduxStore } from "../Store";
import { logout, refreshLogin, selectCurrentAccountId } from "../redux/AuthSlice";

export const JwtMiddleware = authMiddleware({
	allowEmptyToken: true,
	token: () => ReduxStore.getState().auth.loginData?.accessToken || "",
	tokenRefreshPromise: () => {
		const state = ReduxStore.getState();
		return fetch(`${process.env.REACT_APP_API_BASE}/api/refresh-token`, {
			method: "POST",
			headers: new Headers({ "content-type": "application/json" }),
			body: JSON.stringify({
				refreshToken: state.auth.loginData?.refreshToken,
				accountId: selectCurrentAccountId(state),
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				const token = json.accessToken;
				ReduxStore.dispatch(refreshLogin({ loginData: json }));

				const tbdData = {
					type: "current-user/setCurrentUser",
					payload: {
						permissionsInAccount: [
							"UserInAccountPermission_System_Owner",
							"AccountPermission_Auth_DriveTimesEnabled",
							"AccountPermission_Auth_GapDaysEnabled",
							"AccountPermission_System_Root",
						],
						user: {
							name: "Karl Kroeber",
						},
						accounts: [
							{
								id: "QWNjb3VudDpBY2NvdW50OjUzZWUyNmUyLTZlMTItNGYxZi1hNzQ3LWVhMWU3ZWE5MzE0Zg==",
								name: "Harkins Field",
							},
							{
								id: "QWNjb3VudDpBY2NvdW50OjA1NDcyODVjLTRjNGEtNDZiZC1hZmJiLTNlOTRjNzM1NDg2Yw==",
								name: "Harkins Preconstruction",
							},
							{
								id: "QWNjb3VudDpoYXJraW5z",
								name: "TeamBuilder Admin (Master)",
							},
						],
					},
				};
				return token;
			})
			.catch(() => {
				ReduxStore.dispatch(logout());
			});
	},
});
