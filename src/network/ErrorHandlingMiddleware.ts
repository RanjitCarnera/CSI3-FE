import { type MiddlewareNextFn, type RelayRequestAny } from "react-relay-network-modern";
import { toast } from "react-toastify";
import { ERROR_MESSAGES } from "../i18n/ERROR_MESSAGES";
import { logout } from "../redux/AuthSlice";
import { ReduxStore } from "../Store";

const LOGOUT_ERRORS = ["auth_refresh_token_expired", "auth_jwt_malformed"].map((e) =>
	e.toLowerCase(),
);

export const ErrorHandlingMiddleware = (next: MiddlewareNextFn) => async (req: RelayRequestAny) => {
	const res = await next(req);
	const errors = res.errors?.map((e) => e.message?.toLowerCase()) || [];
	const needsToLogout = LOGOUT_ERRORS.find((le) => errors.includes(le));
	if (needsToLogout) {
		ReduxStore.dispatch(logout());
	} else {
		errors?.forEach((e) => {
			const message = ERROR_MESSAGES[e] || e;
			toast.error(message);
		});
	}

	return res;
};
