import { z } from "zod";

export const applyFromCucTemplateFormSchema = z.object({
	cucTemplateRef: z.string({ message: "Please select a cuc template" }),
});
