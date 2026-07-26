/**
 * Permission strings issued to the user via `User.permissions` (see
 * `@/domains/user/models/user`). These are checked client-side to decide
 * what to render — the source of truth for who actually *has* which
 * permission lives with your auth provider / backend.
 */
export const Permissions = {
  SUBMISSION_CREATE: "submission:create",
  SUBMISSION_VIEW: "submission:view",
  ADMIN_PROBLEMS_READ: "problem:read:admin",
  ADMIN_USERS_READ: "user:read:admin",
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];
