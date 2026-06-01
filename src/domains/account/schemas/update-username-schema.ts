import z from "zod";

export const updateUsernameSchema = z.object({
  username: z
    .string()
    .min(1, {
      message: "Username must be at least 1 character",
    })
    .regex(/^[A-Za-z0-9_-]/, {
      message:
        "Username only allows letters, numbers, hyphens, and underscores",
    })
    .max(36, {
      message: "Username must be at most 36 characters",
    }),
});
