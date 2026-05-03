import { Permissions } from "../permissions/models/permissions";

export interface Account {
  id: string;
  username: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date | null;
  usernameLastChangedAt: Date | null;
  permissions?: Permissions[];
}
