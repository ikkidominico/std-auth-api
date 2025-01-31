import z from "zod";

export const forgotSchema = z.object({
    body: z.object({
        email: z.string().email(),
    }),
});
