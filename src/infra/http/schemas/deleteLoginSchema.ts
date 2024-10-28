import z from "zod";

export const deleteLoginSchema = z.object({
    body: z.object({
        method: z.enum(["local", "google"]),
    }),
});
