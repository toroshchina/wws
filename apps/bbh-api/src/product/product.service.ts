import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IProduct } from './product.model';
import { PatchProductPayload } from './payload/patch.product.payload';
import { CreateProductPayload } from './payload/create.product.payload';

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
 * Product Service
 */
@Injectable()
export class ProductService {
  /**
   * Constructor
   * @param {Model<IProduct>} productModel
   */
  constructor(
    @InjectModel('Product') private readonly productModel: Model<IProduct>
  ) {}

  /**
   * Fetches a product from database by UUID
   * @param {string} id
   * @returns {Promise<IProduct>} queried product data
   */
  getById(id: string): Promise<IProduct> {
    return this.productModel.findById(id).exec();
  }

  /**
   * Fetches a list of products from database
   * @param {string} search
   * @param {string} sortBy
   * @param {string} order
   * @param {number} offset
   * @param {number} limit
   * @returns {Promise<IProduct[]>} queried list of products
   */
  getProductList(
    search: string,
    sortBy: string,
    order: number,
    offset: number,
    limit: number
  ): Promise<IProduct[]> {
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
    return this.productModel
      .find(filter)
      .sort(sort)
      .skip(offset > 0 ? offset * limit : 0)
      .limit(limit)
      .exec();
  }

  /**
   * Fetches total count of products from database
   * @param {string} search
   * @param {string} sortBy
   * @param {string} order
   * @param {number} offset
   * @param {number} limit
   * @returns {Promise<number>} count
   */
  getProductCount(search: string): Promise<number> {
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
    return this.productModel.find(filter).countDocuments().exec();
  }

  /**
   * Create a product with RegisterPayload fields
   * @param {IProduct} payload product payload
   * @returns {Promise<IProduct>} created product data
   */
  async create(payload: CreateProductPayload): Promise<IProduct> {
    const createdProduct = new this.productModel({
      ...payload,
    });

    return createdProduct.save();
  }

  /**
   * Edit product data
   * @param {PatchProductPayload} payload
   * @returns {Promise<IProduct>} mutated product data
   */
  async edit(id: string, payload: PatchProductPayload): Promise<IProduct> {
    const res = await this.getById(id);
    const updatedProduct = await this.productModel.updateOne(
      { _id: res._id },
      payload
    );
    if (updatedProduct.nModified !== 1) {
      throw new BadRequestException(
        'The product with that id does not exist in the system. Please try another id.'
      );
    }
    return this.getById(id);
  }

  /**
   * Delete product given a id
   * @param {string} id
   * @returns {Promise<IGenericMessageBody>} whether or not the crud operation was completed
   */
  async delete(id: string): Promise<IGenericMessageBody> {
    const res = await this.getById(id);
    return this.productModel.deleteOne({ _id: res._id }).then((product) => {
      if (product.deletedCount === 1) {
        return { message: `Deleted ${res.name} from records` };
      } else {
        throw new BadRequestException(
          `Failed to delete a product by the name of ${res.name}.`
        );
      }
    });
  }
}
