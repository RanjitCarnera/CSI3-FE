import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { decodeToken } from "react-jwt";
import { type Permission } from "@relay/PermissionsField_Query.graphql";
import { LOCAL_STORAGE_KEY_CURRENT_SCENARIO } from "../components/ui/ChangeCurrentScenarioButton";
import { type ReduxState } from "../Store";

export interface JwtClaimData {
	userId: string;

	accountId: string;
	permissionsInAccount: Permission[];
	accountsWithAccess: string[];
}

export interface JwtTokenData {
	accessToken: string;
	refreshToken: string;
}

export interface AuthState {
	isLoggedIn: boolean;
	loginData?: JwtTokenData;
}

let parsedLoginData: JwtTokenData | undefined;
export const LOCAL_STORAGE_LOGIN_DATA_KEY = "tkt-login-data";
try {
	const storedData = localStorage.getItem(LOCAL_STORAGE_LOGIN_DATA_KEY);

	parsedLoginData = storedData ? JSON.parse(storedData) : undefined;
} catch {}

const INITIAL_STATE: AuthState = {
	isLoggedIn: !!parsedLoginData,
	loginData: parsedLoginData,
};

const authSlice = createSlice({
	name: "auth",
	initialState: INITIAL_STATE,
	reducers: {
		setLoggedIn: (
			state,
			action: PayloadAction<{ tokenData: JwtTokenData; redirect?: string }>,
		) => {
			state.isLoggedIn = true;
			state.loginData = action.payload.tokenData;
			localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT_SCENARIO);
			localStorage.setItem(
				LOCAL_STORAGE_LOGIN_DATA_KEY,
				JSON.stringify(action.payload.tokenData),
			);
			if (action.payload.redirect) {
				window.location.replace("/");
			} else {
				window.location.href = "/";
			}
		},
		refreshLogin: (state, action: PayloadAction<{ loginData: JwtTokenData }>) => {
			state.isLoggedIn = true;
			state.loginData = {
				accessToken: action.payload.loginData.accessToken,
				refreshToken: action.payload.loginData.refreshToken,
			};
			localStorage.setItem(
				LOCAL_STORAGE_LOGIN_DATA_KEY,
				JSON.stringify(action.payload.loginData),
			);
		},
		logout: (state) => {
			state.isLoggedIn = false;
			state.loginData = undefined;
			localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT_SCENARIO);
			localStorage.removeItem(LOCAL_STORAGE_LOGIN_DATA_KEY);
			window.location.reload();
		},
	},
});

export const { setLoggedIn, refreshLogin, logout } = authSlice.actions;
export const AuthSliceReducer = authSlice.reducer;

const selectAuthSlice = (state: ReduxState) => state.auth;

export const selectJwtClaimData = createSelector(selectAuthSlice, (state) => {
	if (state.loginData) {
		return decodeToken<JwtClaimData>(state.loginData.accessToken);
	} else {
		return null;
	}
});

export const selectLoginData = createSelector(selectAuthSlice, (state) => {
	return state.loginData;
});

export const selectCurrentAccountId = createSelector(selectJwtClaimData, (jwtClaimData) => {
	return jwtClaimData?.accountId;
});
