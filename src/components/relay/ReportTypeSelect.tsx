import { Dropdown } from "primereact/dropdown";
import { useSelector } from "react-redux";
import { selectCurrentAccountId } from "@redux/AuthSlice";
import { ellisdonLondonOpsAccountId, randAccountId } from "@utils/account-ids";
import { type ReportType } from "../../__generated__/GenerateReportButton_GenerateReportMutation.graphql";
import { selectHasPermissions } from "../../redux/CurrentUserSlice";
import { type ValidatedFieldConfig } from "../ui/ValidatedField";

export const ReportTypeSelect = (fieldConfig: ValidatedFieldConfig<ReportType>) => {
	const londonOpsSuperReportOption = {
		label: "Recently changed assignments (London Ops)",
		value: "LondonOpsSuperReport",
	};

	const hasPermissions = useSelector(selectHasPermissions);
	const hasReportsPermission = hasPermissions(["AccountPermission_Auth_Reports"]);
	const currentAccountId = useSelector(selectCurrentAccountId);
	const isRandAccount = currentAccountId === randAccountId;
	const isEllisdonLondonOps = currentAccountId === ellisdonLondonOpsAccountId;

	const options: Array<{ label: string; value: string }> = [
		{ label: "Grouped by Resource", value: "GroupedResourceReport" },
		{ label: "Grouped by Resource (Day Gantt)", value: "GroupedResourceDayReport" },
		{ label: "Projects", value: "ProjectReport" },
		{ label: "Unstaffed Assignments", value: "UnstaffedPositionsReport" },
		{ label: "Grouped by Stages", value: "GroupedByStagesReport" },
		{ label: "Gap report", value: "GapReport" },
		{ label: "Availability report", value: "AvailabilityReport" },
		{ label: "Current field staff location", value: "CurrentFieldStaffLocationReport" },
		{ label: "Availability forecast report", value: "AvailabilityForecast" },
		{
			label: "Grouped by Stages w Contact Info",
			value: "GroupedByStagesWithContactInfoReport",
		},
	];

	if (hasReportsPermission) {
		options.push(
			{
				label: "Grouped by Stages (with next assignment)",
				value: "GroupedByStagesNextAssignmentReport",
			},
			{
				label: "Recently changed assignments",
				value: "AssignmentsWithSupersReport",
			},
		);
	}
	if (isRandAccount) {
		options.push({ label: "Resource Report", value: "RandAssignmentsReport" });
	}

	if (isEllisdonLondonOps) {
		options.push(londonOpsSuperReportOption);
	}

	return (
		<Dropdown
			name={fieldConfig.fieldName}
			value={fieldConfig.fieldValue}
			options={options}
			onChange={(e) => {
				fieldConfig.updateField(e.value);
			}}
			filter={true}
			placeholder={fieldConfig.placeholder}
		/>
	);
};
