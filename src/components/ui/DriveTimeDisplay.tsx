import { useSelector } from "react-redux";
import { selectDriveTimeCalculations, selectDriveTimeErrors } from "../../redux/ProjectViewSlice";
import React from "react";

interface OwnProps {
	projectId?: string;
	personId?: string;
}

export const DriveTimeDisplay = ({ projectId, personId }: OwnProps) => {
	const driveTimeCalculations = useSelector(selectDriveTimeCalculations);
	const driveTimeErrors = useSelector(selectDriveTimeErrors);

	const driveTimeCalculation = driveTimeCalculations?.find(
		(dtc) => dtc.personId === personId && dtc.projectId === projectId,
	);
	const error = driveTimeErrors?.find(
		(dtc) => dtc.personId === personId && dtc.projectId === projectId,
	);

	if (projectId && driveTimeCalculation?.driveTime?.length) {
		return <div className="text-sm pl-1">Drive Time: {driveTimeCalculation?.driveTime}</div>;
	} else if (projectId && error) {
		return (
			<div className="text-sm pl-1">
				<i className="pi pi-exclamation-triangle text-yellow-500 mr-2" /> Drive Time Error:{" "}
				{error?.error}
			</div>
		);
	} else {
		return null;
	}
};
