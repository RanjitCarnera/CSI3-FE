import { EmailTemplatesTable } from "../../components/relay/EmailTemplatesTable";
import { graphql } from "babel-plugin-relay/macro";
import { useLazyLoadQuery } from "react-relay";
import { ProjectFiltersComponent } from "@components/project-filters";
import { SettingsScreenTemplate } from "@components/settings-screen-template/settings-screen-template.component";
import { emailTemplatesScreen_EmailTemplatesQuery } from "@relay/emailTemplatesScreen_EmailTemplatesQuery.graphql";

const QUERY = graphql`
	query emailTemplatesScreen_EmailTemplatesQuery {
		...EmailTemplatesTable_EmailTemplatesListFragment
	}
`;

export const EMAIL_TEMPLATES_PATH = "/settings/email-templates";

export const EmailTemplatesScreen = () => {
	const data = useLazyLoadQuery<emailTemplatesScreen_EmailTemplatesQuery>(
		QUERY,
		{},
		{ fetchPolicy: "network-only" },
	);

	return (
		<SettingsScreenTemplate
			title={"E-Mail Templates"}
			Filters={ProjectFiltersComponent}
			Table={() => <EmailTemplatesTable emailTemplatesFragmentRef={data} />}
		/>
	);
};
