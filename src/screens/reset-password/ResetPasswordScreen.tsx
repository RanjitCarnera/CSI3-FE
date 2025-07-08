import React from "react";
import { AuthScreenBase } from "../../components/ui/AuthScreenBase";
import { ResetPasswordForm } from "../../components/relay/ResetPasswordForm";
import { useMatch } from "react-router-dom";
import { TkMessage } from "../../components/ui/TkMessage";

export const RESET_PASSWORD_PATH = "/reset-password/:token";

export const ResetPasswordScreen = () => {
	const match = useMatch(RESET_PASSWORD_PATH);
	const token = match?.params.token;

	if (!token) {
		return (
			<AuthScreenBase>
				<h1 className="text-center mb-6 text">Token not valid!</h1>
				<TkMessage severity="error" text="This reset link is not valid (anymore)." />
			</AuthScreenBase>
		);
	}

	return (
		<AuthScreenBase>
			<div>
				<h1 className="text-center mb-6 text">Reset password</h1>
				<ResetPasswordForm token={token} />
			</div>
		</AuthScreenBase>
	);
};
