import graphql from "babel-plugin-relay/macro";
import { type FormikProps } from "formik/dist/types";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { NavLink, useMatch } from "react-router-dom";
import { type AcceptInvitationScreen_AcceptInvitationMutation } from "../../__generated__/AcceptInvitationScreen_AcceptInvitationMutation.graphql";
import { type AcceptInvitationScreen_AcceptInvitationWithNewUserMutation } from "../../__generated__/AcceptInvitationScreen_AcceptInvitationWithNewUserMutation.graphql";
import { type AcceptInvitationScreen_Query } from "../../__generated__/AcceptInvitationScreen_Query.graphql";
import { AuthScreenBase } from "../../components/ui/AuthScreenBase";
import {
	RegistrationForm,
	type RegistrationFormState,
} from "../../components/ui/registration-form";
import { TkButton } from "../../components/ui/TkButton";
import { TkButtonLink } from "../../components/ui/TkButtonLink";
import { TkMessage } from "../../components/ui/TkMessage";
import { selectCurrentUser } from "../../redux/CurrentUserSlice";

const QUERY = graphql`
	query AcceptInvitationScreen_Query($token: String!) {
		Auth {
			InvitationByToken(token: $token) {
				invitingUserName
				accountName
			}
		}
	}
`;

const ACCEPT_INVITATION_MUTATION = graphql`
	mutation AcceptInvitationScreen_AcceptInvitationMutation($input: AcceptInviteInput!) {
		Management {
			acceptInvitation(input: $input) {
				clientMutationId
			}
		}
	}
`;

const ACCEPT_INVITATION_WITH_NEW_USER_MUTATION = graphql`
	mutation AcceptInvitationScreen_AcceptInvitationWithNewUserMutation(
		$input: AcceptInviteWithNewUserInput!
	) {
		Management {
			acceptInvitationWithNewUser(input: $input) {
				clientMutationId
			}
		}
	}
`;

export const ACCEPT_INVITATION_PATH = "/accept-invitation/:token";

type AcceptanceStatus = "not-accepted" | "accepted" | "accepted-with-new-account";

export const AcceptInvitationScreen = () => {
	const match = useMatch(ACCEPT_INVITATION_PATH);
	const token = match?.params.token;

	const currentUser = useSelector(selectCurrentUser);

	const {
		Auth: { InvitationByToken },
	} = useLazyLoadQuery<AcceptInvitationScreen_Query>(QUERY, { token: token! });
	const [acceptInvitation, isAccepting] =
		useMutation<AcceptInvitationScreen_AcceptInvitationMutation>(ACCEPT_INVITATION_MUTATION);
	const [acceptInvitationWithNewAccount] =
		useMutation<AcceptInvitationScreen_AcceptInvitationWithNewUserMutation>(
			ACCEPT_INVITATION_WITH_NEW_USER_MUTATION,
		);

	const [invitationStatus, setInvitationStatus] = useState<AcceptanceStatus>("not-accepted");

	const formik = useRef<FormikProps<RegistrationFormState>>();

	return (
		<AuthScreenBase>
			<div className="pl-6 pr-6 pb-4">
				<h1 className="text-center mb-6 text">Accept invitation.</h1>

				{InvitationByToken ? (
					<>
						<p>
							{InvitationByToken?.invitingUserName} has invited you to join{" "}
							{InvitationByToken?.accountName}
						</p>

						{invitationStatus !== "not-accepted" ? (
							<div>
								{invitationStatus === "accepted" && (
									<TkMessage
										severity={"success"}
										content={
											<>
												You have accepted the invite.{" "}
												<TkButtonLink
													label="To account"
													onClick={() => (window.location.href = "/")}
												/>
											</>
										}
									/>
								)}

								{invitationStatus === "accepted-with-new-account" && (
									<TkMessage
										severity={"success"}
										content={
											<>
												<div>
													Thank you for accepting the invite and
													registering!
												</div>
												<NavLink className="mt-3" to={"/"}>
													<TkButtonLink
														className="w-12"
														label={"Login to your new account..."}
													/>
												</NavLink>
											</>
										}
									/>
								)}
							</div>
						) : (
							<div>
								{currentUser ? (
									<div>
										<div className="mb-3">
											You are already logged in. Click the button to join the
											account.
										</div>

										<TkButton
											disabled={isAccepting}
											label={"Accept invitation"}
											onClick={() => {
												acceptInvitation({
													variables: {
														input: { token: token! },
													},
													onCompleted: () => {
														setInvitationStatus("accepted");
													},
												});
											}}
										/>
									</div>
								) : (
									<>
										<RegistrationForm
											hideAccountName={true}
											ref={formik as any}
											onSuccess={(values, onSuccess) => {
												acceptInvitationWithNewAccount({
													variables: {
														input: {
															email: values.email!,
															name: values.name,
															password: values.password!,
															token: token!,
														},
													},
													onCompleted: () => {
														setInvitationStatus(
															"accepted-with-new-account",
														);
														onSuccess && onSuccess();
													},
												});
											}}
										/>
										<TkButton
											disabled={formik.current?.isSubmitting}
											type="button"
											onClick={() => formik.current?.handleSubmit()}
											label={"Register and accept invite"}
											className="mt-2"
										/>
									</>
								)}
							</div>
						)}
					</>
				) : (
					<>
						<TkMessage
							severity={"error"}
							content={
								<>
									This invitation is not valid. Please check the link you followed
									or ask the inviter to invite you again.
								</>
							}
						/>
					</>
				)}
			</div>
		</AuthScreenBase>
	);
};
