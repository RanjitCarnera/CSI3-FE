import { personDetailsControl_PersonFragment$key } from "@relay/personDetailsControl_PersonFragment.graphql";
import { personDetailsControl_AssignmentListFragment$key } from "@relay/personDetailsControl_AssignmentListFragment.graphql";

export interface PersonDetailsControlProps {
	personFragmentRef: personDetailsControl_PersonFragment$key;
	assignmentsFragmentRef: personDetailsControl_AssignmentListFragment$key;
}
