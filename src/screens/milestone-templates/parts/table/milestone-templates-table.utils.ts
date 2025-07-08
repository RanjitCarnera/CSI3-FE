import { readInlineData } from "react-relay";
import { fetchQuery } from "relay-runtime";
import { type milestoneTemplatesTable_FetchQuery } from "@relay/milestoneTemplatesTable_FetchQuery.graphql";
import {
	type milestoneTemplatesTable_MilestoneTemplateInlineFragment$data,
	type milestoneTemplatesTable_MilestoneTemplateInlineFragment$key,
} from "@relay/milestoneTemplatesTable_MilestoneTemplateInlineFragment.graphql";
import {
	FETCH_QUERY,
	MILESTONE_TEMPLATE_INLINE_FRAGMENT,
} from "@screens/milestone-templates/parts/table/milestone-templates-table.graphql";
import { RelayEnvironment } from "../../../../RelayEnvironment";

/**
 * Get all milestone templates for the cuc field.
 */
export const getMilestoneTemplates = async (): Promise<
	milestoneTemplatesTable_MilestoneTemplateInlineFragment$data[]
> => {
	return await fetchQuery<milestoneTemplatesTable_FetchQuery>(
		RelayEnvironment,
		FETCH_QUERY,
		{},
		{ fetchPolicy: "network-only" },
	)
		.toPromise()
		.then((res) => {
			return (
				res?.MilestoneTemplate.MilestoneTemplate.edges?.map((e) => {
					return readInlineData<milestoneTemplatesTable_MilestoneTemplateInlineFragment$key>(
						MILESTONE_TEMPLATE_INLINE_FRAGMENT,
						e?.node!,
					);
				}) ?? []
			);
		})
		.catch((reason) => {
			// eslint-disable-next-line no-console
			console.error(reason);
			return [];
		});
};
