export interface User {
  username: string;
  usernameLastChangedAt?: Date;
  permissions: string[];
  roles: string[];
}
