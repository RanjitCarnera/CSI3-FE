import type {
	UnitSystem,
	unitSystemForm_QueryFragment$key,
} from "@relay/unitSystemForm_QueryFragment.graphql";

export interface UnitSystemFormProps {
	queryFragmentRef: unitSystemForm_QueryFragment$key;
}
export interface UnitSystemFormState {
	unitSystem: UnitSystem;
}
