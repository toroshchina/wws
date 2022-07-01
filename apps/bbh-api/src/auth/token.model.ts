import { Schema, Document } from "mongoose";

/**
 * Mongoose Token Schema
 */
export const Token = new Schema({
  value: { type: String, required: true },
  username: { type: String, required: true }
});

/**
 * Mongoose Token Document
 */
export interface IToken extends Document {
	/**
	 * UUID
	 */
	readonly _id: Schema.Types.ObjectId;
	/**
	 * Value
	 */
	readonly value: string;
	/**
	 * Username
	 */
	readonly username: string;
}