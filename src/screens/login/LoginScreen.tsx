import { TkComponentsContext } from "@thekeytechnology/framework-react-components";
import React from "react";
import { HarkinsTheme } from "@corestyle/component-theme/component-theme";
import { LoginForm } from "@screens/login/parts/login-form/login.form";
import { AuthScreenBase } from "../../components/ui/AuthScreenBase";

export const LoginScreen = () => {
	return (
		<AuthScreenBase>
			<TkComponentsContext.Provider value={HarkinsTheme}>
				<div>
					<h1 className="text-center mb-6 text">Welcome back!</h1>
					<LoginForm />
				</div>
			</TkComponentsContext.Provider>
		</AuthScreenBase>
	);
};
