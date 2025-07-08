import React, { useEffect, useState } from "react";

import { Dropdown } from "primereact/dropdown";
import { fetchQuery } from "relay-runtime";
import { readInlineData, useRelayEnvironment } from "react-relay";
import { ValidatedFieldConfig } from "../../ui/ValidatedField";
import { selectUserInAccountField_PeopleQuery } from "@relay/selectUserInAccountField_PeopleQuery.graphql";
import {
	selectUserInAccountField_PersonFragment$data,
	selectUserInAccountField_PersonFragment$key,
} from "@relay/selectUserInAccountField_PersonFragment.graphql";
import {
	QUERY,
	USER_FRAGMENT,
} from "@components/relay/select-user-in-account-field/select-user-in-account-field.graphql";
import { fallbackEmptyMessage } from "@components/relay/select-user-in-account-field/select-user-in-account-field.consts";

export const SelectUserInAccountField = ({
	fieldValue,
	fieldName,
	updateField,
	disabled,
	placeholder,
	accountId,
	emptyMessage = fallbackEmptyMessage,
	first = 20,
	...props
}: ValidatedFieldConfig<string> & { accountId: string; emptyMessage?: string; first?: number }) => {
	const environment = useRelayEnvironment();
	const [users, setUsers] = useState<selectUserInAccountField_PersonFragment$data[]>([]);

	useEffect(() => {
		fetchQuery<selectUserInAccountField_PeopleQuery>(environment, QUERY, {
			alwaysIncludeIds: fieldValue ? [fieldValue] : undefined,
			excludeIds: undefined,
			accountId,
			first,
		})
			.toPromise()
			.then((result) => {
				setUsers(() =>
					result!.Assessment.PeopleInAccount.edges!.map((e) =>
						readInlineData<selectUserInAccountField_PersonFragment$key>(
							USER_FRAGMENT,
							e!.node!,
						),
					),
				);
			});
		// eslint-disable-next-line
	}, []);

	return (
		<Dropdown
			className="mr-2"
			emptyMessage={"Search for users"}
			disabled={disabled}
			placeholder={placeholder}
			name={fieldName}
			value={fieldValue}
			options={[
				{ label: emptyMessage, value: null },
				...users.map((p) => {
					return {
						label: p.name,
						name: p.name,
						value: p.id,
					};
				}),
			]}
			onChange={(e) => {
				updateField(e.value);
			}}
			filter={true}
			filterBy={"name"}
			onFilter={(e) => {
				fetchQuery<selectUserInAccountField_PeopleQuery>(environment, QUERY, {
					filterByName: e.filter?.length > 0 ? e.filter : undefined,
					alwaysIncludeIds: fieldValue ? [fieldValue] : undefined,
					excludeIds: undefined,
					accountId,
					first,
				})
					.toPromise()
					.then((result) => {
						setUsers(() =>
							result!.Assessment.PeopleInAccount.edges!.map((e) =>
								readInlineData<selectUserInAccountField_PersonFragment$key>(
									USER_FRAGMENT,
									e!.node!,
								),
							),
						);
					});
			}}
			{...props}
		/>
	);
};
