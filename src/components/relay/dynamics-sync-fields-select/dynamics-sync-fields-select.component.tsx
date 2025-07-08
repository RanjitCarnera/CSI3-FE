import { MultiSelect } from "primereact/multiselect";
import { type DynamicsSyncFields } from "@relay/syncDynamicsProjectsButton_SyncProjectsFromDynamicsMutation.graphql";
import { DYNAMICS_SYNC_FIELDS } from "./dynamics-sync-fields-select.const";
import { type ValidatedFieldConfig } from "../../ui/ValidatedField";

export const DynamicsSyncFieldsSelect = (
	fieldConfig: ValidatedFieldConfig<DynamicsSyncFields[]>,
) => {
	const availableFields = Object.values(DYNAMICS_SYNC_FIELDS);
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
