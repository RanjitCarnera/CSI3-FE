import { SkillsKind } from "@screens/skill-assessment-execution/parts/category-form/category-form.consts";
import { BinaryInput } from "@screens/skill-assessment-execution/parts/binary-form";
import { categoryForm_AssessmentFragment$key } from "@relay/categoryForm_AssessmentFragment.graphql";

export type CategoryFormProps = {
	assessmentFragmentRef: categoryForm_AssessmentFragment$key;
};

type Info = {
	contents: string[];
	kind: SkillsKind;
};
//TODO deprecated?
type Skills =
	| {
			kind: SkillsKind.binary;
			initialValue?: BinaryInput;
			name: string;
			description: string;
			info: Info;
	  }
	| {
			kind: SkillsKind.range;
			initialValue?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
			name: string;
			description: string;
			info: Info;
	  };
