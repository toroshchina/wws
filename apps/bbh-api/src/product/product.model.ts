import { Schema, Document } from "mongoose";

/**
 * Mongoose Product Schema
 */
export const Product = new Schema({
  description: { type: String, required: true},
  name: { type: String, required: true },
  tastes: { type: [String] },
  strength: { type: String },
  line: { type: Schema.Types.ObjectId, ref: 'Line' },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
  manufacturer: { type: Schema.Types.ObjectId, ref: 'Manufacturer' },
  logo: { type: String },
  usernameCreate: { type: String, required: true },
  usernameUpdate: { type: String, required: true },
  dateCreate: { type: Date },
  dateUpdate: { type: Date }
});

/**
 * Mongoose Product Document
 */
export interface IProduct extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;
  /**
   * Description
   */
  readonly description: string;
  /**
   * Line
   */
  readonly line: Schema.Types.ObjectId;
  /**
   * Brand
   */
  readonly brand: Schema.Types.ObjectId;
  /**
   * Name
   */
  readonly name: string;
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