import { z } from "zod";

export const importProjectMilestoneMarkerFormSchema = z.object({
	milestoneRef: z.string({ message: "Please select a project milestone" }),
});
