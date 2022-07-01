import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IManufacturer } from './manufacturer.model';
import { PatchManufacturerPayload } from './payload/patch.manufacturer.payload';
import { CreateManufacturerPayload } from './payload/create.manufacturer.payload';

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
 * Manufacturer Service
 */
@Injectable()
export class ManufacturerService {
  /**
   * Constructor
   * @param {Model<IManufacturer>} manufacturerModel
   */
  constructor(
    @InjectModel('Manufacturer')
    private readonly manufacturerModel: Model<IManufacturer>
  ) {}

  /**
   * Fetches a manufacturer from database by UUID
   * @param {string} id
   * @returns {Promise<IManufacturer>} queried manufacturer data
   */
  getById(id: string): Promise<IManufacturer> {
    return this.manufacturerModel.findById(id).exec();
  }

  /**
   * Fetches a list of manufacturers from database
   * @param {string} search
   * @param {string} sortBy
   * @param {string} order
   * @param {number} offset
   * @param {number} limit
   * @returns {Promise<IManufacturer[]>} queried list of manufacturers
   */
  getManufacturerList(
    search: string,
    sortBy: string,
    order: number,
    offset: number,
    limit: number
  ): Promise<IManufacturer[]> {
    const sort = {};
    sort[sortBy] = order;
    const re = new RegExp(search, 'i');
    const filter = search
      ? {
          $or: [
            { name: { $regex: re } },
            { usernameCreate: { $regex: re } },
            { usernameUpdate: { $regex: re } },
          ],
        }
      : {};
    return this.manufacturerModel
      .find(filter)
      .sort(sort)
      .skip(offset > 0 ? offset * limit : 0)
      .limit(limit)
      .exec();
  }

  /**
   * Fetches total count of manufacturers from database
   * @param {string} search
   * @param {string} sortBy
   * @param {string} order
   * @param {number} offset
   * @param {number} limit
   * @returns {Promise<number>} count
   */
  getManufacturerCount(search: string): Promise<number> {
    const re = new RegExp(search, 'i');
    const filter = search
      ? {
          $or: [
            { name: { $regex: re } },
            { usernameCreate: { $regex: re } },
            { usernameUpdate: { $regex: re } },
          ],
        }
      : {};
    return this.manufacturerModel.find(filter).countDocuments().exec();
  }

  /**
   * Create a manufacturer with RegisterPayload fields
   * @param {IManufacturer} payload manufacturer payload
   * @returns {Promise<IManufacturer>} created manufacturer data
   */
  async create(payload: CreateManufacturerPayload): Promise<IManufacturer> {
    const createdManufacturer = new this.manufacturerModel({
      ...payload,
    });

    return createdManufacturer.save();
  }

  /**
   * Edit manufacturer data
   * @param {PatchManufacturerPayload} payload
   * @returns {Promise<IManufacturer>} mutated manufacturer data
   */
  async edit(
    id: string,
    payload: PatchManufacturerPayload
  ): Promise<IManufacturer> {
    const res = await this.getById(id);
    const updatedManufacturer = await this.manufacturerModel.updateOne(
      { _id: res._id },
      payload
    );
    if (updatedManufacturer.nModified !== 1) {
      throw new BadRequestException(
        'The manufacturer with that id does not exist in the system. Please try another id.'
      );
    }
    return this.getById(id);
  }

  /**
   * Delete manufacturer given a id
   * @param {string} id
   * @returns {Promise<IGenericMessageBody>} whether or not the crud operation was completed
   */
  async delete(id: string): Promise<IGenericMessageBody> {
    const res = await this.getById(id);
    return this.manufacturerModel
      .deleteOne({ _id: res._id })
      .then((manufacturer) => {
        if (manufacturer.deletedCount === 1) {
          return { message: `Deleted ${res.name} from records` };
        } else {
          throw new BadRequestException(
            `Failed to delete a manufacturer by the name of ${res.name}.`
          );
        }
      });
  }
}
