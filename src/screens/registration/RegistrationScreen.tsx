import React, { useRef, useState } from "react";
import graphql from "babel-plugin-relay/macro";
import { useMutation } from "react-relay";
import { RegistrationScreen_LoginMutation } from "../../__generated__/RegistrationScreen_LoginMutation.graphql";
import { TkMessage } from "../../components/ui/TkMessage";
import { NavLink } from "react-router-dom";
import { TkButtonLink } from "../../components/ui/TkButtonLink";
import { AuthScreenBase } from "../../components/ui/AuthScreenBase";
import { RegistrationForm, RegistrationFormState } from "../../components/ui/registration-form";
import { TkButton } from "../../components/ui/TkButton";
import { FormikProps } from "formik/dist/types";

const REGISTRATION_MUTATION = graphql`
	mutation RegistrationScreen_LoginMutation($input: RegistrationInput!) {
		Auth {
			register(input: $input) {
				accountId
			}
		}
	}
`;

export const RegistrationScreen = () => {
	const [register] = useMutation<RegistrationScreen_LoginMutation>(REGISTRATION_MUTATION);
	const [isRegistered, setIsRegistered] = useState<boolean>();

	const formik = useRef<FormikProps<RegistrationFormState>>();

	return (
		<AuthScreenBase>
			<div className="pl-6 pr-6 pb-4">
				<h1 className="text-center mb-6 text">Create a new account.</h1>

				{isRegistered ? (
					<div>
						<TkMessage
							severity={"success"}
							content={
								<>
									<div>
										Thank you for registering! As a final step, please validate
										your e-mail address.
										<br />
										We've sent you an email with instructions.
									</div>
									<NavLink className="mt-3" to={"/login"}>
										<TkButtonLink
											className="w-12"
											label={"Login to your new account..."}
										/>
									</NavLink>
								</>
							}
						/>
					</div>
				) : (
					<>
						<RegistrationForm
							hideAccountName={false}
							ref={formik as any}
							onSuccess={(values, onSuccess) => {
								register({
									variables: {
										input: {
											email: values.email!,
											name: values.name,
											password: values.password!,
											accountName: values.accountName,
										},
									},
									onCompleted: () => {
										setIsRegistered(true);
										onSuccess && onSuccess();
									},
								});
							}}
						/>
						<TkButton
							disabled={formik.current?.isSubmitting}
							type="button"
							onClick={() => formik.current?.handleSubmit()}
							label={"Register"}
							className="mt-2"
						/>

						<div className="mt-5">
							<NavLink to={"/login"}>
								<TkButtonLink label={"Already have an account? Login here..."} />
							</NavLink>
						</div>
					</>
				)}
			</div>
		</AuthScreenBase>
	);
};
