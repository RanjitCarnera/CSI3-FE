import { type DynamicsSyncFields } from "@relay/syncDynamicsProjectsButton_SyncProjectsFromDynamicsMutation.graphql";

export const DYNAMICS_SYNC_FIELDS: Record<
	Exclude<DynamicsSyncFields, "%future added value">,
	string
> = {
	Name: "Name",
	Address: "Address",
	StartDate: "Start Date",
	EndDate: "End Date",
	StartDateMoveAssignments: "Start Date (also move assignment dates)",
	EndDateMoveAssignments: "End Date (also move assignment dates)",
	Division: "Division",
	Region: "Region",
	Volume: "Volume",
	Stage: "Stage",
	Architect: "Architect",
	ClientName: "Client Name",
};
