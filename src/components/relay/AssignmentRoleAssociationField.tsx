import { useState } from "react";
import { CUCField } from "@components/cuc-field";
import { DEFAULT_CUC_FIELD_MARKERS } from "@components/cuc-field/cuc-field.consts";
import { CUCLayer } from "@components/cuc-field/parts/cuc-field-context/cuc-field-context.types";
import { type AssignmentRoleAssociationInputWithCuc } from "@components/relay/EditStaffingTemplateModal";
import { AssignmentRoleSelect } from "./AssignmentRoleSelect";
import { type AssignmentRoleAssociationInput } from "../../__generated__/EditStaffingTemplateModal_EditMutation.graphql";
import { DefaultSwitchComponent } from "../ui/DefaultTextInput";
import { TkButton } from "../ui/TkButton";
import { TkCard } from "../ui/TkCard";
import { type ValidatedFieldConfig } from "../ui/ValidatedField";

export const AssignmentRoleAssociationField = ({
	fieldValue,
	updateField,
}: ValidatedFieldConfig<AssignmentRoleAssociationInputWithCuc[]>) => {
	const currentAssociations = fieldValue || [];
	const [newSelection, setNewSelection] = useState<string>();
	return (
		<div>
			{currentAssociations.map((selected, index) => {
				return (
					<TkCard
						className="mb-2"
						key={"assignment-role" + selected.assignmentRoleRef + index}
					>
						<div className={"flex flex-column gap-2"}>
							<div className="flex align-items-center">
								<div className="mr-2">Assignment {index + 1}</div>
								<div className="flex-grow-1 mr-2">
									<AssignmentRoleSelect
										fieldValue={selected.assignmentRoleRef}
										updateField={(selectedRole) => {
											updateField(
												currentAssociations
													.map((association) => {
														if (association === selected) {
															return {
																...association,
																assignmentRoleRef: selectedRole,
															} as AssignmentRoleAssociationInput;
														} else if (!selected) {
															return undefined;
														} else {
															return association;
														}
													})
													.filter((x) => !!x)
													.map((x) => x!),
											);
										}}
									/>
								</div>
								<div className="mr-1">
									<DefaultSwitchComponent
										fieldValue={selected.isExecutive}
										tooltip={"Executive Role for this Project"}
										updateField={(e) => {
											updateField(
												currentAssociations.map((association) => {
													if (association === selected) {
														return {
															...association,
															isExecutive: e,
														} as AssignmentRoleAssociationInput;
													} else {
														return association;
													}
												}),
											);
										}}
										fieldName={"isExecutive" + (index + "")}
									/>
								</div>
							</div>
							<CUCField
								fieldValue={selected.cuc ?? DEFAULT_CUC_FIELD_MARKERS}
								updateField={(e) => {
									updateField(
										currentAssociations.map((association) => {
											if (association === selected) {
												return {
													...association,
													cuc: e,
												} as AssignmentRoleAssociationInputWithCuc;
											} else {
												return association;
											}
										}),
									);
								}}
								layer={CUCLayer.Layer2}
							/>
						</div>
					</TkCard>
				);
			})}

			<div className="flex align-items-center">
				<div className="flex-grow-1 mr-2">
					<AssignmentRoleSelect
						fieldValue={newSelection}
						updateField={(e) => {
							setNewSelection(e);
						}}
					/>
				</div>

				<div>
					<TkButton
						type="button"
						label="+"
						disabled={!newSelection}
						onClick={() => {
							updateField([
								...currentAssociations,
								{
									assignmentRoleRef: newSelection!,
									isExecutive: false,
								},
							]);
						}}
					/>
				</div>
			</div>
		</div>
	);
};
