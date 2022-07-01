import { Schema, Document } from "mongoose";

/**
 * Mongoose Manufacturer Schema
 */
export const Manufacturer = new Schema({
  description: { type: String, required: true},
  name: { type: String, required: true },
  entityName: { type: String },
  inn: { type: String },
  country: { type: String },
  logo: { type: String },
  producer: { type: Schema.Types.ObjectId, ref: 'Producer' },
  usernameCreate: { type: String, required: true },
  usernameUpdate: { type: String, required: true },
  dateCreate: { type: Date },
  dateUpdate: { type: Date }
});

/**
 * Mongoose Manufacturer Document
 */
export interface IManufacturer extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;
  /**
   * Producer
   */
  readonly producer: Schema.Types.ObjectId;
  /**
   * Description
   */
  readonly description: string;
  /**
   * Name
   */
  readonly name: string;
  /**
   * Entity Name
   */
  readonly entityName: string;
  /**
   * INN
   */
  readonly inn: string;
  /**
   * Country
   */
  readonly country: string;
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