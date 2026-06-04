import z from "zod";

export const upsertAccountSchema = z.object({
  sub: z.string(),
});
