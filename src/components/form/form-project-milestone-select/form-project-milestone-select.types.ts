import { type DropdownOption } from "@thekeytechnology/epic-ui/dist/components/dropdown/dropdown.types";
import type { ValidatedFieldConfig } from "@components/ui/ValidatedField";

export type FormProjectMilestoneSelectProps = {
	options: DropdownOption[];
} & ValidatedFieldConfig<string>;
