import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query accountSettingsScreen_Query {
		...ChangeLogoForm_CurrentUser
		...editNumericalDimensionExplanationsForm_QueryFragment
		...editAccountSettingsForm_QueryFragment
		...editAssessmentPasswordForm_QueryFragment
		...editAzureAdSsoConfigurationForm_QueryFragment
	}
`;
