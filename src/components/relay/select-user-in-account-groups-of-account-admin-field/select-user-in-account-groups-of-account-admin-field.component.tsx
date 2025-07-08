import { useLazyLoadQuery } from "react-relay";
import { MultiSelect } from "primereact/multiselect";
import { selectUserInAccountGroupsOfAccountAdminField_Query } from "@relay/selectUserInAccountGroupsOfAccountAdminField_Query.graphql";
import { SELECT_USER_IN_ACCOUNT_GROUPS_OF_ACCOUNT_ADMIN_QUERY } from "@components/relay/select-user-in-account-groups-of-account-admin-field/select-user-in-account-groups-of-account-admin-field.graphql";
import { SelectUserInAccountGroupsOfAccountAdminFieldProps } from "@components/relay/select-user-in-account-groups-of-account-admin-field/select-user-in-account-groups-of-account-admin-field.interface";

export const SelectUserInAccountGroupsOfAccountAdminField = ({
	accountId,
	config: { fieldValue, fieldName, updateField },
}: SelectUserInAccountGroupsOfAccountAdminFieldProps) => {
	const {
		Admin: {
			Management: {
				UserInAccountGroupsInAccountAdmin: { edges: groups },
			},
		},
	} = useLazyLoadQuery<selectUserInAccountGroupsOfAccountAdminField_Query>(
		SELECT_USER_IN_ACCOUNT_GROUPS_OF_ACCOUNT_ADMIN_QUERY,
		{
			accountId: accountId,
		},
	);

	return (
		<MultiSelect
			name={fieldName}
			value={fieldValue}
			options={groups
				?.map((g) => g!.node!)
				.map((p) => {
					return {
						label: p.name,
						name: p.name,
						value: p.id,
					};
				})}
			onChange={(e) => updateField(e.value)}
			filter={true}
			filterBy={"name"}
		/>
	);
};
