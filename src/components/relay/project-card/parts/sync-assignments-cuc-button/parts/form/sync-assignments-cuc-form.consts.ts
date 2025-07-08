import { z } from "zod";
import { cucSchema } from "@screens/cuc-templates/parts/edit-cuc-template-form/edit-cuc-template-form.consts";

export const syncAssignmentsCucFormSchema = z.object({
	data: z.array(
		z.object({
			assignmentId: z.string(),
			cuc: cucSchema,
		}),
	),
});
