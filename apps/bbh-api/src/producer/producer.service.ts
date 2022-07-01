import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IProducer } from './producer.model';
import { PatchProducerPayload } from './payload/patch.producer.payload';
import { CreateProducerPayload } from './payload/create.producer.payload';

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
 * Producer Service
 */
@Injectable()
export class ProducerService {
  /**
   * Constructor
   * @param {Model<IProducer>} ProducerModel
   */
  constructor(
    @InjectModel('Producer') private readonly ProducerModel: Model<IProducer>
  ) {}

  /**
   * Fetches a Producer from database by UUID
   * @param {string} id
   * @returns {Promise<IProducer>} queried Producer data
   */
  getById(id: string): Promise<IProducer> {
    return this.ProducerModel.findById(id).exec();
  }

  /**
   * Fetches a list of Producers from database
   * @param {string} search
   * @param {string} sortBy
   * @param {string} order
   * @param {number} offset
   * @param {number} limit
   * @returns {Promise<IProducer[]>} queried list of Producers
   */
  getProducerList(
    search: string,
    sortBy: string,
    order: number,
    offset: number,
    limit: number
  ): Promise<IProducer[]> {
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
    return this.ProducerModel.find(filter)
      .sort(sort)
      .skip(offset > 0 ? offset * limit : 0)
      .limit(limit)
      .exec();
  }

  /**
   * Fetches total count of Producers from database
   * @param {string} search
   * @param {string} sortBy
   * @param {string} order
   * @param {number} offset
   * @param {number} limit
   * @returns {Promise<number>} count
   */
  getProducerCount(search: string): Promise<number> {
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
    return this.ProducerModel.find(filter).countDocuments().exec();
  }

  /**
   * Create a Producer with RegisterPayload fields
   * @param {IProducer} payload Producer payload
   * @returns {Promise<IProducer>} created Producer data
   */
  async create(payload: CreateProducerPayload): Promise<IProducer> {
    const createdProducer = new this.ProducerModel({
      ...payload,
    });

    return createdProducer.save();
  }

  /**
   * Edit Producer data
   * @param {PatchProducerPayload} payload
   * @returns {Promise<IProducer>} mutated Producer data
   */
  async edit(id: string, payload: PatchProducerPayload): Promise<IProducer> {
    const res = await this.getById(id);
    const updatedProducer = await this.ProducerModel.updateOne(
      { _id: res._id },
      payload
    );
    if (updatedProducer.nModified !== 1) {
      throw new BadRequestException(
        'The Producer with that id does not exist in the system. Please try another id.'
      );
    }
    return this.getById(id);
  }

  /**
   * Delete Producer given a id
   * @param {string} id
   * @returns {Promise<IGenericMessageBody>} whether or not the crud operation was completed
   */
  async delete(id: string): Promise<IGenericMessageBody> {
    const res = await this.getById(id);
    return this.ProducerModel.deleteOne({ _id: res._id }).then((Producer) => {
      if (Producer.deletedCount === 1) {
        return { message: `Deleted ${res.name} from records` };
      } else {
        throw new BadRequestException(
          `Failed to delete a Producer by the name of ${res.name}.`
        );
      }
    });
  }
}
