import { z } from "zod";

export const editNameFormSchema = z
	.object({
		name: z.string({ message: "Please provide a name." }).min(1, "Please enter a name"),
	})
	.superRefine((value, ctx) => {
		if (value.name.toLowerCase() === "start" || value.name.toLowerCase() === "finish") {
			ctx.addIssue({
				path: ["name"],
				message: "Cannot be named 'Start' or 'Finish'.",
				code: "custom",
			});
			return false;
		}
		return true;
	});
