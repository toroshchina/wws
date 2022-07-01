import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IBrand } from './brand.model';
import { PatchBrandPayload } from './payload/patch.brand.payload';
import { CreateBrandPayload } from './payload/create.brand.payload';

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
 * Brand Service
 */
@Injectable()
export class BrandService {
  /**
   * Constructor
   * @param {Model<IBrand>} brandModel
   */
  constructor(
    @InjectModel('Brand') private readonly brandModel: Model<IBrand>
  ) {}

  /**
   * Fetches a brand from database by UUID
   * @param {string} id
   * @returns {Promise<IBrand>} queried brand data
   */
  getById(id: string): Promise<IBrand> {
    return this.brandModel.findById(id).exec();
  }

  /**
   * Fetches a list of brands from database
   * @param {string} search
   * @param {string} sortBy
   * @param {string} order
   * @param {number} offset
   * @param {number} limit
   * @returns {Promise<IBrand[]>} queried list of brands
   */
  getBrandList(
    search: string,
    sortBy: string,
    order: number,
    offset: number,
    limit: number
  ): Promise<IBrand[]> {
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
    return this.brandModel
      .find(filter)
      .sort(sort)
      .skip(offset > 0 ? offset * limit : 0)
      .limit(limit)
      .exec();
  }

  /**
   * Fetches total count of brands from database
   * @param {string} search
   * @param {string} sortBy
   * @param {string} order
   * @param {number} offset
   * @param {number} limit
   * @returns {Promise<number>} count
   */
  getBrandCount(search: string): Promise<number> {
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
    return this.brandModel.find(filter).countDocuments().exec();
  }

  /**
   * Create a brand with RegisterPayload fields
   * @param {IBrand} payload brand payload
   * @returns {Promise<IBrand>} created brand data
   */
  async create(payload: CreateBrandPayload): Promise<IBrand> {
    const createdBrand = new this.brandModel({
      ...payload,
    });

    return createdBrand.save();
  }

  /**
   * Edit brand data
   * @param {PatchBrandPayload} payload
   * @returns {Promise<IBrand>} mutated brand data
   */
  async edit(id: string, payload: PatchBrandPayload): Promise<IBrand> {
    const res = await this.getById(id);
    const updatedBrand = await this.brandModel.updateOne(
      { _id: res._id },
      payload
    );
    if (updatedBrand.nModified !== 1) {
      throw new BadRequestException(
        'The brand with that id does not exist in the system. Please try another id.'
      );
    }
    return this.getById(id);
  }

  /**
   * Delete brand given a id
   * @param {string} id
   * @returns {Promise<IGenericMessageBody>} whether or not the crud operation was completed
   */
  async delete(id: string): Promise<IGenericMessageBody> {
    const res = await this.getById(id);
    return this.brandModel.deleteOne({ _id: res._id }).then((brand) => {
      if (brand.deletedCount === 1) {
        return { message: `Deleted ${res.name} from records` };
      } else {
        throw new BadRequestException(
          `Failed to delete a brand by the name of ${res.name}.`
        );
      }
    });
  }
}
