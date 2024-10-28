import z from "zod";

export const profileSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        birth: z.string().date().optional(),
    }),
});
