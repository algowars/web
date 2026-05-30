import z from "zod";

export const upsertAccountSchema = z.object({
  imageUrl: z.string().optional(),
});

export type UpsertAccount = z.infer<typeof upsertAccountSchema>;
