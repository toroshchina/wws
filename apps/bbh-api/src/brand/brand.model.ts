import { Schema, Document } from "mongoose";

/**
 * Mongoose Brand Schema
 */
export const Brand = new Schema({
  description: { type: String, required: true},
  name: { type: String, required: true },
  strength: { type: String },
  manufacturer: { type: Schema.Types.ObjectId, ref: 'Manufacturer' },
  logo: { type: String },
  usernameCreate: { type: String, required: true },
  usernameUpdate: { type: String, required: true },
  dateCreate: { type: Date },
  dateUpdate: { type: Date }
});

/**
 * Mongoose Brand Document
 */
export interface IBrand extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;
  /**
   * Description
   */
  readonly description: string;
  /**
   * Name
   */
  readonly name: string;
  /**
   * Manufacturer
   */
  readonly manufacturer: Schema.Types.ObjectId;
  /**
   * Strength
   */
  readonly strength: string;
  /**
   * Logo
   */
  readonly logo: string;
  /**
   * Date Create
   */
  readonly dateCreate: Date;
  /**
   * Date Update
   */
  readonly dateUpdate: Date;
  /**
   * Username Create
   */
  readonly usernameCreate: string;
  /**
   * Username Update
   */
  readonly usernameUpdate: string;
}