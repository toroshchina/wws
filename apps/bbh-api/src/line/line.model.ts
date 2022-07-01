import { Schema, Document } from "mongoose";

/**
 * Mongoose Line Schema
 */
export const Line = new Schema({
  description: { type: String, required: true},
  name: { type: String, required: true },
  strength: { type: String },
  tastes: { type: [String] },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
  manufacturer: { type: Schema.Types.ObjectId, ref: 'Manufacturer' },
  logo: { type: String },
  usernameCreate: { type: String, required: true },
  usernameUpdate: { type: String, required: true },
  dateCreate: { type: Date },
  dateUpdate: { type: Date }
});

/**
 * Mongoose Line Document
 */
export interface ILine extends Document {
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
   * Brand
   */
  readonly brand: Schema.Types.ObjectId;
  /**
   * Manufacturer
   */
  readonly manufacturer: Schema.Types.ObjectId;
  /**
   * Tastes
   */
  readonly tastes: string[];
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