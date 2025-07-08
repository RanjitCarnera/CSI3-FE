import React from "react";
import { AuthScreenBase } from "../../components/ui/AuthScreenBase";
import { ForgotPasswordForm } from "../../components/relay/ForgotPasswordForm";

export const ForgotPasswordScreen = () => {
	return (
		<AuthScreenBase>
			<div className="">
				<h1 className="text-center mb-6 text">Forgot password</h1>
				<ForgotPasswordForm />
			</div>
		</AuthScreenBase>
	);
};
