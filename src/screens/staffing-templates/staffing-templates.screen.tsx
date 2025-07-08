import { StaffingTemplateFilters } from "./parts/staffing-template-filters.component";
import React from "react";
import { StaffingTemplatesTable } from "../../components/relay/StaffingTemplatesTable";
import { SettingsScreenTemplate } from "@components/settings-screen-template/settings-screen-template.component";
import { MilestoneTemplateTable } from "@screens/milestone-templates/parts/table";

export const StaffingTemplatesScreen = () => {
	return (
		<SettingsScreenTemplate
			title={"Staffing Templates"}
			Filters={StaffingTemplateFilters}
			Table={() => (
				<>
					<StaffingTemplatesTable />
					<MilestoneTemplateTable />
				</>
			)}
		/>
	);
};
