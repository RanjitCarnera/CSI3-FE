import { type RandSyncFields } from "@relay/syncRandProjectsButton_SyncProjectsFromRandMutation.graphql";

export const RAND_SYNC_FIELDS: Record<Exclude<RandSyncFields, "%future added value">, string> = {
	Name: "Name",
	Address: "Address",
	StartDate: "Start Date",
	EndDate: "End Date",
	StartDateMoveAssignments: "Start Date (also move assignment dates)",
	EndDateMoveAssignments: "End Date (also move assignment dates)",
	Region: "Region",
	Volume: "Volume",
	Stage: "Stage",
	ClientName: "Client Name",
};
