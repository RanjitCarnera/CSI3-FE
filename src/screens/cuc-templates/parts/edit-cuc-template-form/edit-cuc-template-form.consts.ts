import { z } from "zod";

export const cucSchema = z
	.array(
		z.object({
			id: z.string().optional().nullable(),
			name: z.string().optional().nullable(),
			percentageWeight: z.number(),
			percentageTime: z.number(),
			milestoneTemplateRefOpt: z.string().optional().nullable(),
		}),
	)
	.min(2, {
		message: "The CUC needs at least 2 markers.",
	})
	.superRefine(function validateChronologicalTimeLine(values, ctx) {
		if (!values) return true;
		for (let i = 0; i < values.length - 1; i++) {
			if (values[i].percentageTime > values[i + 1].percentageTime) {
				ctx.addIssue({
					code: "custom",
					path: [i],
					message: "Each point in time must be greater than it's predecessor.",
				});
				return false;
			}
		}
		return true;
	})
	.superRefine(function validateNameUniqueness(values, ctx) {
		return true;
		// TODO Layer 2
		// if (!values) return true;
		// const names: string[] = values
		// 	.map((e) => e.name?.toLowerCase().trim())
		// 	.filter((e): e is string => e !== undefined);
		//
		// const hasUniqueName = names.distinct().length === values.length;
		// if (!hasUniqueName) {
		// 	ctx.addIssue({
		// 		code: "custom",
		// 		path: [0],
		// 		message: "Each marker must have a unique name.",
		// 	});
		// }
	});
export const cucTemplateSchema = z.object({
	name: z.string(),
	cuc: cucSchema,
});
