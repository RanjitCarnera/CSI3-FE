import { graphql } from "babel-plugin-relay/macro";

export const QUERY = graphql`
	query personalDataScreen_Query {
		...ChangeShowBudgetForm_CurrentUser
		...volumePerPersonForm_CurrentUser
		...preferredViewTypeForm_CurrentUser
		...twoFactorAuthForm_QueryFragment
		...unitSystemForm_QueryFragment
		...utilizationDisplayForm_QueryFragment
	}
`;
