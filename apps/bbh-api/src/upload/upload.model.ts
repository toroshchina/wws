import { Schema, Document } from 'mongoose';

/**
 * Mongoose Upload Schema
 */
export const Upload = new Schema({
  name: { type: String, required: true },
  usernameCreate: { type: String, required: true },
  dateCreate: { type: Date },
});

/**
 * Mongoose Upload Document
 */
export interface IUpload extends Document {
  /**
   * UUID
   */
  readonly _id: Schema.Types.ObjectId;
  /**
   * Name
   */
  readonly name: string;
  /**
   * Date Create
   */
  readonly dateCreate: Date;
  /**
   * Username Create
   */
  readonly usernameCreate: string;
}
