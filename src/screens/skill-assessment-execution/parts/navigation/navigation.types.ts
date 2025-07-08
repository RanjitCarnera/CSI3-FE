import { NavigationMode } from "@screens/skill-assessment-execution/parts/navigation/navigation.consts";
import { navigation_AssessmentFragment$key } from "@relay/navigation_AssessmentFragment.graphql";

export type NavigationProps = {
	mode: NavigationMode;
	assessmentFragmentRef: navigation_AssessmentFragment$key;
};
