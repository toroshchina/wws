import {
  BadRequestException, Body, Controller, Delete,
  Get, Post, Param, Patch, UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ACGuard, UseRoles } from "nest-access-control";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProductService, IGenericMessageBody } from "./product.service";
import { PatchProductPayload } from "./payload/patch.product.payload";
import type { IProduct } from "./product.model";
import { FilterProductsPayload } from './payload/filter.products.payload';
import { CreateProductPayload } from "./payload/create.product.payload";

/**
 * Product Controller
 */
@ApiBearerAuth()
@ApiTags("product")
@Controller("api/product")
export class ProductController {
  /**
   * Constructor
   * @param productService
   */
  constructor(private readonly productService: ProductService) { }

  /**
   * Retrieves a particular product
   * @param id the product given productname to fetch
   * @returns {Promise<IProduct>} queried product data
   */
  @Get(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Product Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Product Request Failed" })
  async getProduct(@Param("id") id: string): Promise<IProduct> {
    const product = await this.productService.getById(id);
    if (!product) {
      throw new BadRequestException(
        "The product with that productname could not be found.",
      );
    }
    return product;
  }

  /**
   * Retrieves a product list
   * @param {FilterProductsPayload} payload
   * @returns {Promise<IProduct[]>} queried product data
   */
  @Post()
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "products",
    action: "read",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Fetch Products Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Products Request Failed" })
  async getProducts(@Body() payload: FilterProductsPayload): Promise<{ products: IProduct[]; count: number; }> {
    const { search, sortby, order, offset, limit } = payload
    const products = await this.productService.getProductList(search, sortby, order, offset, limit);
    const count = await this.productService.getProductCount(search);
    if (!products) {
      throw new BadRequestException(
        "The product with that productname could not be found.",
      );
    }
    return { products, count };
  }
  
  /**
   * create product
   * @param {CreateProductPayload} payload the product dto
   */
  @Post("create")
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "products",
    action: "update",
    possession: "any",
  })
  @ApiResponse({ status: 201, description: "Created" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  async register(@Body() payload: CreateProductPayload) {
    return await this.productService.create(payload);
  }

  /**
   * Edit a product
   * @param {PatchProductPayload} payload
   * @returns {Promise<IProduct>} mutated product data
   */
  @Patch(':id')
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "products",
    action: "update",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Patch Product Request Received" })
  @ApiResponse({ status: 400, description: "Patch Product Request Failed" })
  async patchProduct(@Param("id") id: string, @Body() payload: PatchProductPayload) {
    return await this.productService.edit(id, payload);
  }

  /**
   * Removes a product from the database
   * @param {string} id the id to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the product has been deleted
   */
  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), ACGuard)
  @UseRoles({
    resource: "products",
    action: "delete",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Delete Product Request Received" })
  @ApiResponse({ status: 400, description: "Delete Product Request Failed" })
  async delete(
    @Param("id") id: string,
  ): Promise<IGenericMessageBody> {
    return await this.productService.delete(id);
  }
}