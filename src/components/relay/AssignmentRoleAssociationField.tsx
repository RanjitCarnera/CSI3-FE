import { AssignmentRoleSelect } from "./AssignmentRoleSelect";
import { TkButton } from "../ui/TkButton";
import { ValidatedFieldConfig } from "../ui/ValidatedField";
import { TkCard } from "../ui/TkCard";
import { useState } from "react";
import { DefaultSwitchComponent } from "../ui/DefaultTextInput";
import { AssignmentRoleAssociationInput } from "../../__generated__/EditStaffingTemplateModal_EditMutation.graphql";

export const AssignmentRoleAssociationField = ({
	fieldValue,
	updateField,
}: ValidatedFieldConfig<AssignmentRoleAssociationInput[]>) => {
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
