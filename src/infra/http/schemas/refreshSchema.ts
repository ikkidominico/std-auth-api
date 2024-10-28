import z from "zod";

export const refreshSchema = z.object({
    params: z.object({
        refreshToken: z.string(),
    }),
});
