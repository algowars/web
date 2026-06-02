import { z } from "zod";

export const accountSetupSchema = z.object({
  username: z
    .string()
    .min(1, "Username must be at least one character")
    .regex(/^[A-Za-z0-9_-]+$/, {
      message:
        "Username only allows letters, numbers, hyphens, and underscores",
    })
    .max(36, {
      message: "Username must be at most 36 characters",
    }),
});
