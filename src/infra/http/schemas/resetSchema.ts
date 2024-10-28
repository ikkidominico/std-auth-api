import z from "zod";

export const resetSchema = z.object({
    params: z.object({
        recoveryToken: z.string(),
    }),
    body: z.object({
        password: z.string().min(5),
    }),
});
