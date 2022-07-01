import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ILine } from './line.model';
import { PatchLinePayload } from './payload/patch.line.payload';
import { CreateLinePayload } from './payload/create.line.payload';

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
 * Line Service
 */
@Injectable()
export class LineService {
  /**
   * Constructor
   * @param {Model<ILine>} LineModel
   */
  constructor(@InjectModel('Line') private readonly LineModel: Model<ILine>) {}

  /**
   * Fetches a Line from database by UUID
   * @param {string} id
   * @returns {Promise<ILine>} queried Line data
   */
  getById(id: string): Promise<ILine> {
    return this.LineModel.findById(id).exec();
  }

  /**
   * Fetches a list of Lines from database
   * @param {string} search
   * @param {string} sortBy
   * @param {string} order
   * @param {number} offset
   * @param {number} limit
   * @returns {Promise<ILine[]>} queried list of Lines
   */
  getLineList(
    search: string,
    sortBy: string,
    order: number,
    offset: number,
    limit: number
  ): Promise<ILine[]> {
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
    return this.LineModel.find(filter)
      .sort(sort)
      .skip(offset > 0 ? offset * limit : 0)
      .limit(limit)
      .exec();
  }

  /**
   * Fetches total count of Lines from database
   * @param {string} search
   * @param {string} sortBy
   * @param {string} order
   * @param {number} offset
   * @param {number} limit
   * @returns {Promise<number>} count
   */
  getLineCount(search: string): Promise<number> {
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
    return this.LineModel.find(filter).countDocuments().exec();
  }

  /**
   * Create a Line with RegisterPayload fields
   * @param {ILine} payload Line payload
   * @returns {Promise<ILine>} created Line data
   */
  async create(payload: CreateLinePayload): Promise<ILine> {
    const createdLine = new this.LineModel({
      ...payload,
    });

    return createdLine.save();
  }

  /**
   * Edit Line data
   * @param {PatchLinePayload} payload
   * @returns {Promise<ILine>} mutated Line data
   */
  async edit(id: string, payload: PatchLinePayload): Promise<ILine> {
    const res = await this.getById(id);
    const updatedLine = await this.LineModel.updateOne(
      { _id: res._id },
      payload
    );
    if (updatedLine.nModified !== 1) {
      throw new BadRequestException(
        'The Line with that id does not exist in the system. Please try another id.'
      );
    }
    return this.getById(id);
  }

  /**
   * Delete Line given a id
   * @param {string} id
   * @returns {Promise<IGenericMessageBody>} whether or not the crud operation was completed
   */
  async delete(id: string): Promise<IGenericMessageBody> {
    const res = await this.getById(id);
    return this.LineModel.deleteOne({ _id: res._id }).then((Line) => {
      if (Line.deletedCount === 1) {
        return { message: `Deleted ${res.name} from records` };
      } else {
        throw new BadRequestException(
          `Failed to delete a Line by the name of ${res.name}.`
        );
      }
    });
  }
}
