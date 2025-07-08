import { type preferredViewTypeForm_CurrentUser$key } from "@relay/preferredViewTypeForm_CurrentUser.graphql";
import { type PreferredViewType } from "@relay/preferredViewTypeForm_SetPreferredViewTypeMutation.graphql";

export interface PreferredViewTypeFormState {
	preferredViewType?: PreferredViewType;
}
export interface PreferredViewTypeFormProps {
	queryFragmentRef: preferredViewTypeForm_CurrentUser$key;
}
