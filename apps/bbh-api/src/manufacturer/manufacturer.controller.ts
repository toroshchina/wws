import {
  BadRequestException, Body, Controller, Delete,
  Get, Post, Param, Patch, UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ACGuard, UseRoles } from "nest-access-control";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ManufacturerService, IGenericMessageBody } from "./manufacturer.service";
import { PatchManufacturerPayload } from "./payload/patch.manufacturer.payload";
import { CreateManufacturerPayload } from "./payload/create.manufacturer.payload";
import type { IManufacturer } from "./manufacturer.model";
import { FilterManufacturersPayload } from './payload/filter.manufacturers.payload';

/**
 * Manufacturer Controller
 */
@ApiBearerAuth()
@ApiTags("manufacturer")
@Controller("api/manufacturer")
export class ManufacturerController {
  /**
   * Constructor
   * @param manufacturerService
   */
  constructor(private readonly manufacturerService: ManufacturerService) { }

  /**
   * Retrieves a particular manufacturer
   * @param id the manufacturer given manufacturername to fetch
   * @returns {Promise<IManufacturer>} queried manufacturer data
   */
  @Get(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Manufacturer Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Manufacturer Request Failed" })
  async getManufacturer(@Param("id") id: string): Promise<IManufacturer> {
    const manufacturer = await this.manufacturerService.getById(id);
    if (!manufacturer) {
      throw new BadRequestException(
        "The manufacturer with that manufacturername could not be found.",
      );
    }
    return manufacturer;
  }

  /**
   * Retrieves a manufacturer list
   * @param {FilterManufacturersPayload} payload
   * @returns {Promise<IManufacturer[]>} queried manufacturer data
   */
  @Post()
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "manufacturers",
    action: "read",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Fetch Manufacturers Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Manufacturers Request Failed" })
  async getManufacturers(@Body() payload: FilterManufacturersPayload): Promise<{ manufacturers: IManufacturer[]; count: number; }> {
    const { search, sortby, order, offset, limit } = payload
    const manufacturers = await this.manufacturerService.getManufacturerList(search, sortby, order, offset, limit);
    const count = await this.manufacturerService.getManufacturerCount(search);
    if (!manufacturers) {
      throw new BadRequestException(
        "The manufacturer with that manufacturername could not be found.",
      );
    }
    return { manufacturers, count };
  }
  
  /**
   * create manufacturer
   * @param {CreateManufacturerPayload} payload the manufacturer dto
   */
  @Post("create")
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "manufacturers",
    action: "update",
    possession: "any",
  })
  @ApiResponse({ status: 201, description: "Created" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  async register(@Body() payload: CreateManufacturerPayload) {
    return await this.manufacturerService.create(payload);
  }

  /**
   * Edit a manufacturer
   * @param {PatchManufacturerPayload} payload
   * @returns {Promise<IManufacturer>} mutated manufacturer data
   */
  @Patch(':id')
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "manufacturers",
    action: "update",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Patch Manufacturer Request Received" })
  @ApiResponse({ status: 400, description: "Patch Manufacturer Request Failed" })
  async patchManufacturer(@Param("id") id: string, @Body() payload: PatchManufacturerPayload) {
    return await this.manufacturerService.edit(id, payload);
  }

  /**
   * Removes a manufacturer from the database
   * @param {string} id the id to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the manufacturer has been deleted
   */
  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), ACGuard)
  @UseRoles({
    resource: "manufacturers",
    action: "delete",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Delete Manufacturer Request Received" })
  @ApiResponse({ status: 400, description: "Delete Manufacturer Request Failed" })
  async delete(
    @Param("id") id: string,
  ): Promise<IGenericMessageBody> {
    return await this.manufacturerService.delete(id);
  }
}