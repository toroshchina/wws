import { Schema, Document } from "mongoose";

/**
 * Mongoose Producer Schema
 */
export const Producer = new Schema({
  description: { type: String, required: true},
  name: { type: String, required: true },
  entityName: { type: String },
  inn: { type: String },
  country: { type: String },
  logo: { type: String },
  usernameCreate: { type: String, required: true },
  usernameUpdate: { type: String, required: true },
  dateCreate: { type: Date },
  dateUpdate: { type: Date }
});

/**
 * Mongoose Producer Document
 */
export interface IProducer extends Document {
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