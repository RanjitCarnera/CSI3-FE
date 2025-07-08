import React from "react";
import { type Milestone } from "./edit-project-form.interface";
import { DefaultCalendarComponent, DefaultTextFieldComponent } from "../DefaultTextInput";
import { TkButton } from "../TkButton";
import { TkButtonLink } from "../TkButtonLink";
import { type ValidatedFieldConfig } from "../ValidatedField";

export function MilestonesField(fieldConfig: ValidatedFieldConfig<Milestone[]>) {
	const rows = fieldConfig.fieldValue || [];

	return (
		<div>
			<div>
				{fieldConfig.fieldValue?.map((row, index) => {
					return (
						<div className="flex align-items-center mb-2" key={"row-" + index}>
							<div className="flex-grow-1 ml-2">
								<DefaultTextFieldComponent
									placeholder={"Milestone Name"}
									fieldValue={row.name}
									isValid={fieldConfig.isValid}
									updateField={(newValue) => {
										fieldConfig.updateField(
											rows.map((r, i) => {
												return {
													...r,
													name: i === index ? newValue || "" : r.name,
												};
											}),
										);
									}}
								/>
							</div>
							<div className="flex-grow-1 ml-2">
								<DefaultCalendarComponent
									fieldValue={row.date}
									placeholder={"Date"}
									isValid={fieldConfig.isValid}
									updateField={(newValue) => {
										fieldConfig.updateField(
											rows.map((r, i) => {
												return {
													...r,
													date:
														i === index
															? newValue || new Date().toUTCString()
															: r.date,
												};
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
				label={"Add Milestone"}
				onClick={() => {
					fieldConfig.updateField([
						...rows,
						{
							id: undefined,
							name: "",
							date: "",
						},
					]);
				}}
			/>
		</div>
	);
}
