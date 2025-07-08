import { type MarkerInput } from "@components/cuc-field/cuc-field.types";

export interface SyncAssignmentWithCucInput {
	assignmentId: string;
	shouldSync: boolean;
	cucTemplateRef?: string;
	cuc?: MarkerInput[];
}
