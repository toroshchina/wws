import { Schema, Document } from "mongoose";
import { AppRoles } from "../app/app.roles";

/**
 * Mongoose User Schema
 */
export const User = new Schema({
  username: { type: String, required: true},
  email: { type: String, required: true},
  name: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String, required: true },
  roles: [{ type: String }],
  date: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Mongoose User Document
 */
export interface IUser extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;
  /**
   * Username
   */
  readonly username: string;
  /**
   * Email
   */
  readonly email: string;
  /**
   * Name
   */
  readonly name: string;
  /**
   * Password
   */
  password: string;
  /**
   * Gravatar
   */
  readonly avatar: string;
  /**
   * Roles
   */
  readonly roles: AppRoles;
  /**
   * Date
   */
  readonly date: Date;
}