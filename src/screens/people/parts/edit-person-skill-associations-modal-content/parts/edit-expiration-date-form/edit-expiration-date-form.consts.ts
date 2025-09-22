import { z } from "zod";

export const editExpirationDateFormSchema = z.object({
	expirationDate: z.coerce.date().optional().nullish().nullable(),
});
