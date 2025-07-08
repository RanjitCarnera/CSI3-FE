import moment from "moment-timezone";
import { type assignmentsInProject_AssignmentInlineFragment$data } from "@relay/assignmentsInProject_AssignmentInlineFragment.graphql";

export function sortBySmallestStartDate(
	assignments: assignmentsInProject_AssignmentInlineFragment$data[],
): assignmentsInProject_AssignmentInlineFragment$data[] {
	return [...assignments].sort(
		(a, b) => moment(a.startDate).toDate().getTime() - moment(b.startDate).toDate().getTime(),
	);
}

export function sortByLargestEndDate(
	assignments: assignmentsInProject_AssignmentInlineFragment$data[],
): assignmentsInProject_AssignmentInlineFragment$data[] {
	return [...assignments].sort(
		(a, b) => moment(b.endDate).toDate().getTime() - moment(a.endDate).toDate().getTime(),
	);
}
