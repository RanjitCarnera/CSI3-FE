import { z } from "zod";

export const milestoneTemplateDataSchema = z
	.object({
		name: z.string(),
		timeInPercent: z.number(),
	})
	.superRefine(function disallowStartAndFinishAsName(arg, ctx) {
		if (arg.name.toLowerCase() === "start" || arg.name.toLowerCase() === "finish") {
			ctx.addIssue({
				path: ["name"],
				code: "custom",
				message: "The names 'Start' & 'Finish' are reserved.",
			});
		}
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
