import { graphql } from "babel-plugin-relay/macro";
import moment from "moment-timezone";
import React, { useMemo } from "react";
import { useFragment } from "react-relay";
import { type ProjectDateTimeDisplay_ProjectFragment$key } from "../../__generated__/ProjectDateTimeDisplay_ProjectFragment.graphql";
import { DateDisplay } from "../ui/DateTimeDisplay";

const PROJECT_FRAGMENT = graphql`
	fragment ProjectDateTimeDisplay_ProjectFragment on Project {
		startDate
		endDate
		durationInMonths
	}
`;

interface OwnProps {
	projectFragmentRef: ProjectDateTimeDisplay_ProjectFragment$key;
}

export const ProjectDateTimeDisplay = ({ projectFragmentRef }: OwnProps) => {
	const project = useFragment<ProjectDateTimeDisplay_ProjectFragment$key>(
		PROJECT_FRAGMENT,
		projectFragmentRef,
	);

	const isPast = useMemo(
		() => moment(project.endDate).isSameOrBefore(moment.now()),
		[project.endDate],
	);

	return (
		<>
			<span style={{ color: isPast ? "darkred" : "unset" }}>
				<DateDisplay value={project.startDate} /> - <DateDisplay value={project.endDate} />{" "}
			</span>
			{project.durationInMonths ? (
				<span className={"ml-2"}>({project.durationInMonths} months)</span>
			) : (
				<React.Fragment />
			)}
		</>
	);
};
