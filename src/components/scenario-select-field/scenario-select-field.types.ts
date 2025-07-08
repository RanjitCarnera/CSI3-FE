import type { ValidatedFieldConfig } from "@components/ui/ValidatedField";

export type ScenarioSelectFieldProps = ValidatedFieldConfig<string> & {
	onlyMaster?: boolean;
	onlyMine?: boolean;
};
