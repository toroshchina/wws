/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IUpload } from './upload.model';

/**
 * Models a typical response for a crud operation
 */
export interface IGenericMessageBody {
  /**
   * Status message to return
   */
  message: string;
}

/**
 * Upload Service
 */
@Injectable()
export class UploadService {
  /**
   * Constructor
   * @param {Model<IUpload>} uploadModel
   */
  constructor(
    @InjectModel('Upload') private readonly uploadModel: Model<IUpload>
  ) {}

  /**
   * Fetches a upload from database by UUID
   * @param {string} id
   * @returns {Promise<IUpload>} queried upload data
   */
  getById(id: string): Promise<IUpload> {
    return this.uploadModel.findById(id).exec();
  }

  /**
   * Fetches a list of uploads from database
   * @param {string} search
   * @param {string} sortBy
   * @param {string} order
   * @param {number} offset
   * @param {number} limit
   * @returns {Promise<IUpload[]>} queried list of uploads
   */
  getUploadList(
    search: string,
    sortBy: string,
    order: number,
    offset: number,
    limit: number
  ): Promise<IUpload[]> {
    const sort = {};
    sort[sortBy] = order;
    const re = new RegExp(search, 'i');
    const filter = search
      ? {
          $or: [{ name: { $regex: re } }, { usernameCreate: { $regex: re } }],
        }
      : {};
    return this.uploadModel
      .find(filter)
      .sort(sort)
      .skip(offset > 0 ? offset * limit : 0)
      .limit(limit)
      .exec();
  }

  /**
   * Fetches total count of uploads from database
   * @param {string} search
   * @param {string} sortBy
   * @param {string} order
   * @param {number} offset
   * @param {number} limit
   * @returns {Promise<number>} count
   */
  getUploadCount(search: string): Promise<number> {
    const re = new RegExp(search, 'i');
    const filter = search
      ? {
          $or: [{ name: { $regex: re } }, { usernameCreate: { $regex: re } }],
        }
      : {};
    return this.uploadModel.find(filter).countDocuments().exec();
  }

  /**
   * Create a upload with RegisterPayload fields
   * @param {IUpload} payload upload payload
   * @returns {Promise<IUpload>} created upload data
   */
  async create({ files, body }): Promise<any> {
    const arr = files.map((file) => {
      return {
        name: file.filename,
        dateCreate: body.dateCreate,
        usernameCreate: body.usernameCreate,
      };
    });
    return this.uploadModel.insertMany(arr);
  }

  /**
   * Delete upload given a id
   * @param {string} id
   * @returns {Promise<IGenericMessageBody>} whether or not the crud operation was completed
   */
  async delete(id: string): Promise<IGenericMessageBody> {
    const res = await this.getById(id);
    return this.uploadModel.deleteOne({ _id: res._id }).then((upload) => {
      if (upload.deletedCount === 1) {
        return { message: `Deleted ${res.name} from records` };
      } else {
        throw new BadRequestException(
          `Failed to delete a upload by the name of ${res.name}.`
        );
      }
    });
  }
}
