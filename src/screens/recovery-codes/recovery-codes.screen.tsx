import { Button, TkComponentsContext } from "@thekeytechnology/framework-react-components";
import React from "react";
import { readInlineData, useLazyLoadQuery, useMutation } from "react-relay";
import { toast } from "react-toastify";
import { AuthScreenBase } from "@components/ui/AuthScreenBase";
import { HarkinsTheme } from "@corestyle/component-theme/component-theme";
import { type recoveryCodesScreen_GenerateRecoveryCodeCredentialsMutation } from "@relay/recoveryCodesScreen_GenerateRecoveryCodeCredentialsMutation.graphql";
import { type recoveryCodesScreen_Query } from "@relay/recoveryCodesScreen_Query.graphql";
import { type recoveryCodesScreen_RecoveryCodeCredentialsInlineFragment$key } from "@relay/recoveryCodesScreen_RecoveryCodeCredentialsInlineFragment.graphql";
import {
	GENERATE_RECOVERY_CODES_MUTATION,
	QUERY,
	RECOVERY_CODE_CREDENTIALS_INLINE_FRAGMENT,
} from "@screens/recovery-codes/recovery-codes.graphql";
import { ButtonsWrapper, Code, CodesWrapper } from "@screens/recovery-codes/recovery-codes.styles";
import { RedirectTo } from "../../navigation/RedirectTo";

export const RECOVERY_CODES_SCREEN_PATH = "/settings/personal-data/recovery-codes";
export const RecoveryCodesScreen = () => {
	const query = useLazyLoadQuery<recoveryCodesScreen_Query>(QUERY, {});
	const hasActivatedTwoFactorAuthToken =
		query.Viewer.Auth.twoFactorAuthToken?.data.isActivated ?? false;
	const [generate] = useMutation<recoveryCodesScreen_GenerateRecoveryCodeCredentialsMutation>(
		GENERATE_RECOVERY_CODES_MUTATION,
	);

	if (!query.Viewer.Auth?.recoveryCodeCredentials) return <RedirectTo to={"/login"} />;
	const credentials =
		readInlineData<recoveryCodesScreen_RecoveryCodeCredentialsInlineFragment$key>(
			RECOVERY_CODE_CREDENTIALS_INLINE_FRAGMENT,
			query.Viewer.Auth.recoveryCodeCredentials,
		);
	const codes = credentials.data.credentials ?? [];

	const handleDonwloadOnClick = () => {
		const element = document.createElement("a");
		const file = new Blob([codes.join("\n")], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = "recovery-codes.txt";
		document.body.appendChild(element);
		element.click();
		toast.success("Recovery codes downloaded.");
	};
	const handleCopyOnClick = () => {
		void navigator.clipboard.writeText([...codes].join("\n"));
		toast.success("Recovery codes copied to clipboard.");
	};
	const handleGenerateOnClick = () => {
		generate({
			variables: {
				input: {},
			},
			onCompleted: () => {
				window.location.reload();
				toast.success("Generated new recovery codes.");
			},
		});
	};
	const DownloadButton = (
		<Button content={{ label: "Download" }} onClick={handleDonwloadOnClick} />
	);
	const CopyButton = <Button content={{ label: "Copy" }} onClick={handleCopyOnClick} />;
	const ReGenerateButton = (
		<Button
			content={{ label: "Regenerate" }}
			inputVariant={hasActivatedTwoFactorAuthToken ? "solid" : "error"}
			onClick={handleGenerateOnClick}
			disabled={!hasActivatedTwoFactorAuthToken}
		/>
	);
	return (
		<TkComponentsContext.Provider value={HarkinsTheme}>
			<AuthScreenBase>
				<h1>Recovery Codes</h1>
				<CodesWrapper>
					{codes.map((code) => (
						<Code>{code}</Code>
					))}
				</CodesWrapper>
				<ButtonsWrapper>
					{DownloadButton}
					{CopyButton}
					{ReGenerateButton}
				</ButtonsWrapper>
			</AuthScreenBase>
		</TkComponentsContext.Provider>
	);
};
