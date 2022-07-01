import {
  BadRequestException, Body, Controller, Delete,
  Get, Post, Param, Patch, UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ACGuard, UseRoles } from "nest-access-control";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProducerService, IGenericMessageBody } from "./producer.service";
import { PatchProducerPayload } from "./payload/patch.producer.payload";
import type { IProducer } from "./producer.model";
import { FilterProducersPayload } from './payload/filter.producers.payload';
import { CreateProducerPayload } from "./payload/create.producer.payload";

/**
 * Producer Controller
 */
@ApiBearerAuth()
@ApiTags("producer")
@Controller("api/producer")
export class ProducerController {
  /**
   * Constructor
   * @param producerService
   */
  constructor(private readonly producerService: ProducerService) { }

  /**
   * Retrieves a particular Producer
   * @param id the Producer given Producername to fetch
   * @returns {Promise<IProducer>} queried Producer data
   */
  @Get(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Producer Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Producer Request Failed" })
  async getProducer(@Param("id") id: string): Promise<IProducer> {
    const producer = await this.producerService.getById(id);
    if (!producer) {
      throw new BadRequestException(
        "The producer with that Producername could not be found.",
      );
    }
    return producer;
  }

  /**
   * Retrieves a Producer list
   * @param {FilterProducersPayload} payload
   * @returns {Promise<IProducer[]>} queried Producer data
   */
  @Post()
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "producers",
    action: "read",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Fetch Producers Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Producers Request Failed" })
  async getProducers(@Body() payload: FilterProducersPayload): Promise<{ producers: IProducer[]; count: number; }> {
    const { search, sortby, order, offset, limit } = payload
    const producers = await this.producerService.getProducerList(search, sortby, order, offset, limit);
    const count = await this.producerService.getProducerCount(search);
    if (!producers) {
      throw new BadRequestException(
        "The Producer with that Producername could not be found.",
      );
    }
    return { producers, count };
  }
  
  /**
   * create Producer
   * @param {CreateProducerPayload} payload the Producer dto
   */
  @Post("create")
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "producers",
    action: "update",
    possession: "any",
  })
  @ApiResponse({ status: 201, description: "Created" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  async register(@Body() payload: CreateProducerPayload) {
    return await this.producerService.create(payload);
  }

  /**
   * Edit a Producer
   * @param {PatchProducerPayload} payload
   * @returns {Promise<IProducer>} mutated Producer data
   */
  @Patch(':id')
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "producers",
    action: "update",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Patch Producer Request Received" })
  @ApiResponse({ status: 400, description: "Patch Producer Request Failed" })
  async patchProducer(@Param("id") id: string, @Body() payload: PatchProducerPayload) {
    return await this.producerService.edit(id, payload);
  }

  /**
   * Removes a Producer from the database
   * @param {string} id the id to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the Producer has been deleted
   */
  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), ACGuard)
  @UseRoles({
    resource: "producers",
    action: "delete",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Delete Producer Request Received" })
  @ApiResponse({ status: 400, description: "Delete Producer Request Failed" })
  async delete(
    @Param("id") id: string,
  ): Promise<IGenericMessageBody> {
    return await this.producerService.delete(id);
  }
}