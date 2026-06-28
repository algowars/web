import { createAction } from "@reduxjs/toolkit";
import { User } from "../models/user";

export const UserEvents = {
  upsertUserRequested: createAction<{ sub: string }>("user/upsertRequested"),
  upsertUserSuccess: createAction("user/upsertSuccess"),
  upsertUserFailure: createAction<{ message: string }>("user/upsertFailure"),

  initializeUser: createAction("user/initialize"),
  initializeUserSuccess: createAction<User>("user/initializeSuccess"),
  initializeUserFailure: createAction<{ message: string }>(
    "user/initializeFailure"
  ),

  updateUsernameRequested: createAction<{ data: { username: string } }>(
    "user/updateUsernameRequested"
  ),
  updateUsernameSuccess: createAction<User>("user/updateUsernameSuccess"),
  updateUsernameFailure: createAction<{ message: string }>(
    "user/updateUsernameFailure"
  ),

  loggedOut: createAction("user/loggedOut"),
};
