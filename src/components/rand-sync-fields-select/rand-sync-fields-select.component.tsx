import { MultiSelect } from "primereact/multiselect";
import { RAND_SYNC_FIELDS } from "@components/rand-sync-fields-select/rand-sync-fields-select.const";
import { type ValidatedFieldConfig } from "@components/ui/ValidatedField";
import { type RandSyncFields } from "@relay/syncRandProjectsButton_SyncProjectsFromRandMutation.graphql";

export const RandSyncFieldsSelect = (fieldConfig: ValidatedFieldConfig<RandSyncFields[]>) => {
	const availableFields = Object.values(RAND_SYNC_FIELDS);
	return (
		<MultiSelect
			name={fieldConfig.fieldName}
			options={availableFields}
			value={fieldConfig.fieldValue}
			onChange={(e) => {
				fieldConfig.updateField(e.value);
			}}
		/>
	);
};
