import { graphql } from "babel-plugin-relay/macro";
import { Checkbox } from "primereact/checkbox";
import React from "react";
import { useSelector } from "react-redux";
import { useLazyLoadQuery } from "react-relay";
import { withFieldFallback } from "@components/field";
import { PERMISSION_TRANSLATIONS } from "@i18n/permissions.i18n";
import { selectHasStrictPermissions } from "@redux/CurrentUserSlice";
import {
	type Permission,
	type PermissionsField_Query,
} from "@relay/PermissionsField_Query.graphql";
import { type ValidatedFieldConfig } from "../ui/ValidatedField";

const QUERY = graphql`
	query PermissionsField_Query {
		Management {
			AvailablePermissions
		}
	}
`;

export const PermissionsField = ({
	fieldValue,
	updateField,
}: ValidatedFieldConfig<Permission[]>) => {
	const {
		Management: { AvailablePermissions },
	} = useLazyLoadQuery<PermissionsField_Query>(QUERY, {}, { fetchPolicy: "network-only" });

	const hasPermissions = useSelector(selectHasStrictPermissions);
	const hasAccountPermission = hasPermissions(["AccountPermission_Auth_PreConIntegration"]);

	const filteredPermissions = [...AvailablePermissions].filter((permission) => {
		if (permission === "UserInAccountPermission_Precon_Edit") return hasAccountPermission;
		return true;
	});

	const grouped = filteredPermissions
		.filter(
			(p) =>
				p !== "UserInAccountPermission_Tasks_Tasks" &&
				p !== "UserInAccountPermission_Files_Delete",
		)
		.groupBy((x) => x.split("_")[1]);

	return (
		<div>
			<h3 className=" m-0">Permissions</h3>
			<div className="grid">
				{grouped.map((group) => {
					return (
						<div key={group.key} className="col-3">
							<h4>{group.key}</h4>

							<div>
								{group.value.map((v) => (
									<div className="mb-2" key={v}>
										<Checkbox
											inputId={v}
											onChange={(e) => {
												const fieldValueWithoutValue =
													fieldValue?.filter((p) => v !== p) ?? [];
												if (e.checked) {
													updateField([...fieldValueWithoutValue, v]);
												} else {
													updateField(fieldValueWithoutValue);
												}
											}}
											checked={fieldValue?.includes(v) ?? false}
										></Checkbox>
										<label htmlFor="cb3" className="p-checkbox-label">
											{PERMISSION_TRANSLATIONS[v] || v}
										</label>
									</div>
								))}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export const PermissionSuspenseField = withFieldFallback(PermissionsField);
