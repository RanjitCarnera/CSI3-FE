import { z } from "zod";

export const editTimeFormSchema = z
	.object({
		timeInPercent: z.coerce.number(),
	})
	.superRefine(function disallowExtremeTimeInPercent(arg, ctx) {
		if (arg.timeInPercent < -1 || arg.timeInPercent > 2) {
			ctx.addIssue({
				path: ["timeInPercent"],
				code: "custom",
				message: "The percent cannot be less than -100% or greater than 200%.",
			});
		}
	});
