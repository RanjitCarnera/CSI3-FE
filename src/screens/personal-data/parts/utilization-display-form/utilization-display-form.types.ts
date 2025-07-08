import {
	type UtilizationDisplay,
	type utilizationDisplayForm_QueryFragment$key,
} from "@relay/utilizationDisplayForm_QueryFragment.graphql";

export interface UtilizationDisplayFormProps {
	queryFragmentRef: utilizationDisplayForm_QueryFragment$key;
}
export interface UtilizationDisplayFormState {
	utilizationDisplay: UtilizationDisplay;
}
