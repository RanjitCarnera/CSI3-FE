import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Conditional } from "@components/conditional";
import { StaffingTemplatesTable } from "@components/relay/StaffingTemplatesTable";
import { SettingsScreenTemplate } from "@components/settings-screen-template/settings-screen-template.component";
import { selectHasPermissions } from "@redux/CurrentUserSlice";
import { selectActiveFeatureToggleIds } from "@redux/feature-toggles";
import { MilestoneTemplateTable } from "@screens/milestone-templates/parts/table";
import { StaffingTemplateFilters } from "./parts/staffing-template-filters.component";

export const StaffingTemplatesScreen = () => {
	const activeFeatureToggleIds = useSelector(selectActiveFeatureToggleIds);
	const isUsingCUC = activeFeatureToggleIds.includes("CUC");

	const hasPermissions = useSelector(selectHasPermissions);
	const hasTemplateWrite = hasPermissions(["UserInAccountPermission_Templates_Edit"]);
	const hasMilestoneTemplateRead = hasPermissions([
		"UserInAccountPermission_MilestoneTemplate_Read",
	]);

	return (
		<SettingsScreenTemplate
			title={"Staffing Templates"}
			Filters={StaffingTemplateFilters}
			Table={() => (
				<>
					<Conditional.Root condition={hasTemplateWrite}>
						<Conditional.Success>
							<StaffingTemplatesTable />
						</Conditional.Success>
					</Conditional.Root>
					<Conditional.Root condition={isUsingCUC && hasMilestoneTemplateRead}>
						<Conditional.Success>
							<MilestoneTemplateTable />
						</Conditional.Success>
					</Conditional.Root>
				</>
			)}
		/>
	);
};
