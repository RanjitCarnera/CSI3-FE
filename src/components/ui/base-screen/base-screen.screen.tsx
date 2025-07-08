import { graphql } from "babel-plugin-relay/macro";
import { type ReactNode } from "react";
import { useFragment } from "react-relay";
import { BaseScreenWrapper } from "@components/ui/base-screen/base-screen.styles";
import { type baseScreen_QueryFragment$key } from "@relay/baseScreen_QueryFragment.graphql";
import { BaseHeader } from "../BaseHeader";

const FRAGMENT = graphql`
	fragment baseScreen_QueryFragment on Query {
		Viewer {
			Auth {
				currentAccount {
					extensions {
						kind
						... on AccountSettingsAccountExtension {
							kind
							logo {
								...BaseHeader_LogoFragment
							}
						}
					}
				}
			}
		}
	}
`;

interface OwnProps {
	children?: ReactNode;
	headerComponents?: ReactNode;
	queryFragmentRef: baseScreen_QueryFragment$key;
}

export const BaseScreen = ({ children, headerComponents, queryFragmentRef }: OwnProps) => {
	const queryFragment = useFragment<baseScreen_QueryFragment$key>(FRAGMENT, queryFragmentRef);
	const accountSettings = queryFragment.Viewer.Auth.currentAccount?.extensions.find(
		(e) => e.kind === "AccountSettings",
	);
	return (
		<div className="background p-5 flex flex-column h-full">
			<BaseHeader
				queryFragmentRef={accountSettings?.logo || undefined}
				className="mb-4"
				children={headerComponents}
			/>

			<BaseScreenWrapper>{children}</BaseScreenWrapper>
		</div>
	);
};
