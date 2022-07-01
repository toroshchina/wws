import { RolesBuilder } from "nest-access-control";

export enum AppRoles {
  DEFAULT = "DEFAULT",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
}

/**
 * Roles Builder
 */
export const roles: RolesBuilder = new RolesBuilder();

// The default app role doesn't have readAny(users) because the user returned provides a password.
// To mutate the return body of mongoose queries try editing the UserService
roles
  .grant(AppRoles.DEFAULT)
  .readOwn("user")
  .updateOwn("user")
  .deleteOwn("user")
  .readOwn("token")
  .updateOwn("token")
  .deleteOwn("token")
  .grant(AppRoles.MODERATOR)
  .readOwn("user")
  .updateOwn("user")
  .deleteOwn("user")
  .readOwn("token")
  .updateOwn("token")
  .deleteOwn("token")
  .readAny("producers")
  .updateAny("producers")
  .deleteAny("producers")
  .readAny("manufacturers")
  .updateAny("manufacturers")
  .deleteAny("manufacturers")
  .readAny("brands")
  .updateAny("brands")
  .deleteAny("brands")
  .readAny("lines")
  .updateAny("lines")
  .deleteAny("lines")
  .readAny("products")
  .updateAny("products")
  .deleteAny("products")
  .readAny("uploads")
  .updateAny("uploads")
  .deleteAny("uploads")
  .grant(AppRoles.ADMIN)
  .readAny("users")
  .readAny("list")
  .updateAny("users")
  .deleteAny("users")
  .readAny("tokens")
  .updateAny("tokens")
  .deleteAny("tokens");