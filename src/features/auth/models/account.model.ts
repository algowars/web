import { Permissions } from "../permissions/Permissions";

export interface Account {
  id: string;
  username: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date | null;
  permissions?: Permissions[];
}
