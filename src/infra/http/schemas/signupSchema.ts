import z from "zod";

export const signupSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(5),
    }),
});
