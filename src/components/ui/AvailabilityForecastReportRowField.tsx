import { ValidatedFieldConfig } from "./ValidatedField";
import React from "react";
import { AssignmentRolesSelect } from "../relay/AssignmentRolesSelect";
import { TkButtonLink } from "./TkButtonLink";
import { TkButton } from "./TkButton";
import { ForecastRowParameter } from "../../redux/AvailabilityForecastSlice";

export function AvailabilityForecastReportRowField(
	fieldConfig: ValidatedFieldConfig<ForecastRowParameter[]>,
) {
	const rows = fieldConfig.fieldValue || [];

	return (
		<div>
			<div>
				{fieldConfig.fieldValue?.map((row, index) => {
					return (
						<div className="flex align-items-center mb-2">
							<div className="ml-2">Row {index + 1}</div>
							<div className="flex-grow-1 ml-2">
								<AssignmentRolesSelect
									fieldValue={row.rolesRef}
									placeholder={"Select roles"}
									updateField={(newValue) => {
										fieldConfig.updateField(
											rows.map((r) => {
												if (r === row) {
													return { rolesRef: newValue || [] };
												} else {
													return r;
												}
											}),
										);
									}}
								/>
							</div>
							<div>
								<TkButtonLink
									type="button"
									label={"Delete"}
									onClick={() => {
										fieldConfig.updateField(
											rows.filter((r) => {
												return r !== row;
											}),
										);
									}}
								/>
							</div>
						</div>
					);
				})}
			</div>
			<TkButton
				type="button"
				label={"Add row"}
				onClick={() => {
					fieldConfig.updateField([...rows, { rolesRef: [] }]);
				}}
			/>
		</div>
	);
}
