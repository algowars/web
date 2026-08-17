export interface User {
  id: string;
  username: string;
  usernameLastChangedAt?: Date;
  permissions: string[];
  roles: string[];
}
