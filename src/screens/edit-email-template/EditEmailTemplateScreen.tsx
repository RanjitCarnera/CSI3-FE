import { graphql } from "babel-plugin-relay/macro";
import { useFragment, useLazyLoadQuery, useMutation } from "react-relay";
import { useMatch, useNavigate } from "react-router-dom";
import React from "react";
import { BaseSettingsScreen } from "../../components/ui/BaseSettingsScreen";
import { EditEmailTemplateForm } from "../../components/relay/EditEmailTemplateForm";
import { EditEmailTemplateScreen_Query } from "../../__generated__/EditEmailTemplateScreen_Query.graphql";
import { EditEmailTemplateScreen_EmailTemplateFragment$key } from "../../__generated__/EditEmailTemplateScreen_EmailTemplateFragment.graphql";
import { EditEmailTemplateScreen_UpdateMutation } from "../../__generated__/EditEmailTemplateScreen_UpdateMutation.graphql";
import { TkCard } from "../../components/ui/TkCard";
import { EMAIL_TEMPLATES_PATH } from "@screens/email-templates";

const QUERY = graphql`
	query EditEmailTemplateScreen_Query($id: ID!) {
		node(id: $id) {
			... on PersonalizedEmailTemplate {
				...EditEmailTemplateScreen_EmailTemplateFragment
			}
		}
	}
`;

const EMAIL_TEMPLATE_FRAGMENT = graphql`
	fragment EditEmailTemplateScreen_EmailTemplateFragment on PersonalizedEmailTemplate {
		id
		template {
			key
			subject
			previewText
			body
			variables
		}
	}
`;

const UPDATE_MUTATION = graphql`
	mutation EditEmailTemplateScreen_UpdateMutation($input: UpdatePersonalizedEmailTemplateInput!) {
		Admin {
			Email {
				updatePersonalizedEmailTemplate(input: $input) {
					data {
						node {
							...EditEmailTemplateScreen_EmailTemplateFragment
						}
					}
				}
			}
		}
	}
`;

export const EDIT_EMAIL_TEMPLATE_PATH = "/settings/email-templates/:emailTemplateId/edit";

export const EditEmailTemplateScreen = () => {
	const history = useNavigate();
	const match = useMatch(EDIT_EMAIL_TEMPLATE_PATH);
	const query = useLazyLoadQuery<EditEmailTemplateScreen_Query>(QUERY, {
		id: match?.params.emailTemplateId!,
	});

	const emailTemplate = useFragment<EditEmailTemplateScreen_EmailTemplateFragment$key>(
		EMAIL_TEMPLATE_FRAGMENT,
		query.node,
	)!;
	const [update, isUpdating] =
		useMutation<EditEmailTemplateScreen_UpdateMutation>(UPDATE_MUTATION);

	return (
		<BaseSettingsScreen>
			<TkCard
				header={
					<div className="flex p-3 align-items-center card-flat">
						<h1 className="mt-0 mr-3 mb-0 ml-0">Override email template</h1>
					</div>
				}
			>
				<EditEmailTemplateForm
					initialValues={{
						subject: emailTemplate.template.subject,
						preview: emailTemplate.template.previewText,
						body: emailTemplate.template.body,
					}}
					variables={emailTemplate.template.variables}
					loading={isUpdating}
					onSubmit={(values) => {
						const data = {
							key: emailTemplate.template.key,
							subject: values.subject!,
							previewText: values.preview!,
							body: values.body!,
							variables: [...emailTemplate.template.variables],
						};
						if (emailTemplate) {
							update({
								variables: {
									input: {
										id: emailTemplate.id,
										data: data,
									},
								},
								onCompleted: () => {
									history(EMAIL_TEMPLATES_PATH);
								},
							});
						}
					}}
				/>
			</TkCard>
		</BaseSettingsScreen>
	);
};
