import {
  BadRequestException, Body, Controller, Delete,
  Get, Post, Param, Patch, UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ACGuard, UseRoles } from "nest-access-control";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { BrandService, IGenericMessageBody } from "./brand.service";
import { PatchBrandPayload } from "./payload/patch.brand.payload";
import { CreateBrandPayload } from "./payload/create.brand.payload";
import type { IBrand } from "./brand.model";
import { FilterBrandsPayload } from './payload/filter.brands.payload';

/**
 * Brand Controller
 */
@ApiBearerAuth()
@ApiTags("brand")
@Controller("api/brand")
export class BrandController {
  /**
   * Constructor
   * @param brandService
   */
  constructor(private readonly brandService: BrandService) { }

  /**
   * Retrieves a particular brand
   * @param id the brand given brandname to fetch
   * @returns {Promise<IBrand>} queried brand data
   */
  @Get(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Brand Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Brand Request Failed" })
  async getBrand(@Param("id") id: string): Promise<IBrand> {
    const brand = await this.brandService.getById(id);
    if (!brand) {
      throw new BadRequestException(
        "The brand with that brandname could not be found.",
      );
    }
    return brand;
  }

  /**
   * Retrieves a brand list
   * @param {FilterBrandsPayload} payload
   * @returns {Promise<IBrand[]>} queried brand data
   */
  @Post()
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "brands",
    action: "read",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Fetch Brands Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Brands Request Failed" })
  async getBrands(@Body() payload: FilterBrandsPayload): Promise<{ brands: IBrand[]; count: number; }> {
    const { search, sortby, order, offset, limit } = payload
    const brands = await this.brandService.getBrandList(search, sortby, order, offset, limit);
    const count = await this.brandService.getBrandCount(search);
    if (!brands) {
      throw new BadRequestException(
        "The brand with that brandname could not be found.",
      );
    }
    return { brands, count };
  }
  
  /**
   * create brand
   * @param {IBrand} payload the brand dto
   */
  @Post("create")
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "brands",
    action: "update",
    possession: "any",
  })
  @ApiResponse({ status: 201, description: "Created" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  async register(@Body() payload: CreateBrandPayload) {
    return await this.brandService.create(payload);
  }

  /**
   * Edit a brand
   * @param {PatchBrandPayload} payload
   * @returns {Promise<IBrand>} mutated brand data
   */
  @Patch(':id')
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "brands",
    action: "update",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Patch Brand Request Received" })
  @ApiResponse({ status: 400, description: "Patch Brand Request Failed" })
  async patchBrand(@Param("id") id: string, @Body() payload: PatchBrandPayload) {
    return await this.brandService.edit(id, payload);
  }

  /**
   * Removes a brand from the database
   * @param {string} id the id to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the brand has been deleted
   */
  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), ACGuard)
  @UseRoles({
    resource: "brands",
    action: "delete",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Delete Brand Request Received" })
  @ApiResponse({ status: 400, description: "Delete Brand Request Failed" })
  async delete(
    @Param("id") id: string,
  ): Promise<IGenericMessageBody> {
    return await this.brandService.delete(id);
  }
}