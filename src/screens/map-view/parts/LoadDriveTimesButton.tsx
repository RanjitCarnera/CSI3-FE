import { graphql } from "babel-plugin-relay/macro";
import moment from "moment-timezone";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyLoadQuery } from "react-relay";
import { match } from "ts-pattern";
import { type LoadDriveTimesButton_ProjectQuery } from "@relay/LoadDriveTimesButton_ProjectQuery.graphql";
import { TkButton } from "../../../components/ui/TkButton";
import { selectCurrentUser, selectHasPermissions } from "../../../redux/CurrentUserSlice";
import { selectFetchedPeople } from "../../../redux/MapSlice";
import {
	addDriveTimeCalculations,
	type DriveTimeCalculation,
	type DriveTimeError,
	selectDriveTimeCalculations,
} from "../../../redux/ProjectViewSlice";

const PROJECT_QUERY = graphql`
	query LoadDriveTimesButton_ProjectQuery($projectId: ID!) {
		node(id: $projectId) {
			... on Project {
				id
				address {
					latitude
					longitude
				}
			}
		}
	}
`;

interface OwnProps {
	className?: string;
	selectedProjectId: string;
}

export const LoadDriveTimesButton = memo(({ className, selectedProjectId }: OwnProps) => {
	const hasPermissions = useSelector(selectHasPermissions);
	const hasPermission = hasPermissions(["AccountPermission_Auth_DriveTimesEnabled"]);

	const dispatch = useDispatch();
	const query = useLazyLoadQuery<LoadDriveTimesButton_ProjectQuery>(PROJECT_QUERY, {
		projectId: selectedProjectId,
	});
	const project = query.node;
	const driveTimes = useSelector(selectDriveTimeCalculations);
	const people = useSelector(selectFetchedPeople);

	const cu = useSelector(selectCurrentUser);
	return hasPermission ? (
		<TkButton
			tooltip="This will query google maps for the wednesday 8am drive times for the closest 10 people"
			className={className}
			label="Load drive times"
			onClick={() => {
				const service = new google.maps.DistanceMatrixService();
				const destination = `${project?.address?.latitude}, ${project?.address?.longitude}`;

				const errors: DriveTimeError[] = [];

				const drivesTimesToFetch: Array<{
					origin: string;
					destination: string;
					personId: string;
					personName: string;
				}> = people
					.filter((p) => {
						const isValid =
							p.id &&
							p.address &&
							isNumber(p.address.longitude) &&
							isNumber(p.address.latitude);
						if (!isValid) {
							errors.push({
								personId: p.id,
								error: "Invalid address or GPS coordinates.",
								projectId: project?.id!,
							});
						}

						return isValid;
					})
					.filter((p) => {
						return !driveTimes.find(
							(dt) => dt.personId === p.id && dt.projectId === project?.id,
						);
					})
					.slice(0, 10)
					.map((person) => {
						const originWithCoordinates = `${person.address?.latitude}, ${person.address?.longitude}`;
						const originWithAddress = `${person.address?.lineOne} ${person.address?.postalCode} ${person.address?.city}, ${person.address?.state}`;
						const origin =
							person.address?.latitude && person.address?.longitude
								? originWithCoordinates
								: originWithAddress;
						return {
							destination,
							origin,
							personId: person.id,
							personName: person.name,
						};
					})
					.filter((e) => {
						return !driveTimes.find(
							(dt) => dt.personId === e?.personId && dt.projectId === project?.id,
						);
					});

				if (drivesTimesToFetch.length === 0) {
					return;
				}

				const request = {
					origins: drivesTimesToFetch.map((dt) => dt.origin),
					destinations: [destination],
					travelMode: google.maps.TravelMode.DRIVING,
					unitSystem: match(cu?.user.extension.unitSystem)
						.with("Metric", () => google.maps.UnitSystem.METRIC)
						.with("Imperial", () => google.maps.UnitSystem.IMPERIAL)
						.otherwise(() => google.maps.UnitSystem.IMPERIAL),
					avoidHighways: false,
					avoidTolls: false,
					drivingOptions: { departureTime: getNextWednesday4PM() },
				};
				service.getDistanceMatrix(request).then((response) => {
					const driveTimeCalculations: DriveTimeCalculation[] = response.rows
						.map((row, index) => {
							if (!row.elements[0].duration.text) {
								errors.push({
									personId: drivesTimesToFetch[index].personId,
									error: "No route found.",
									projectId: project?.id!,
								});

								return undefined;
							}
							return {
								driveTime: row.elements[0].duration.text,
								personId: drivesTimesToFetch[index].personId,
								projectId: project?.id!,
							};
						})
						.filter((e) => e !== undefined)
						.map((e) => e!);

					dispatch(
						addDriveTimeCalculations({
							driveTimes: driveTimeCalculations,
							errors,
						}),
					);
				});
			}}
		/>
	) : null;
});

function getNextWednesday4PM(): Date {
	const dayInNeed = 3; // Wednesday
	const dayToday = moment().isoWeekday();

	if (dayToday < dayInNeed) {
		return moment().isoWeekday(dayInNeed).hours(8).toDate();
	} else {
		return moment().add(1, "weeks").isoWeekday(dayInNeed).toDate();
	}
}

function isNumber(value?: string | number): boolean {
	return value != null && value !== "" && !isNaN(Number(value.toString()));
}
