import { z } from "zod";

export const selectMilestoneTemplateFormSchema = z.object({
	name: z.string().min(1, "Please select a name"),
});
