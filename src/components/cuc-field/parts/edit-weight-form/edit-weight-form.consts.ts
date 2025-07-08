import { z } from "zod";

export const editWeightFormSchema = z
	.object({
		weightInPercent: z.coerce.number(),
	})
	.superRefine(function disallowExtremeWeightInPercent(arg, ctx) {
		if (arg.weightInPercent < 0 || arg.weightInPercent > 3) {
			ctx.addIssue({
				path: ["weightInPercent"],
				code: "custom",
				message: "The percent cannot be less than 0% or greater than 300%.",
			});
		}
	});
