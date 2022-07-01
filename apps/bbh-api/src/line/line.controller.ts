import {
  BadRequestException, Body, Controller, Delete,
  Get, Post, Param, Patch, UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ACGuard, UseRoles } from "nest-access-control";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LineService, IGenericMessageBody } from "./line.service";
import { PatchLinePayload } from "./payload/patch.line.payload";
import type { ILine } from "./line.model";
import { FilterLinesPayload } from './payload/filter.lines.payload';
import { CreateLinePayload } from "./payload/create.line.payload";

/**
 * Line Controller
 */
@ApiBearerAuth()
@ApiTags("line")
@Controller("api/line")
export class LineController {
  /**
   * Constructor
   * @param lineService
   */
  constructor(private readonly lineService: LineService) { }

  /**
   * Retrieves a particular Line
   * @param id the Line given Linename to fetch
   * @returns {Promise<ILine>} queried Line data
   */
  @Get(":id")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch Line Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Line Request Failed" })
  async getLine(@Param("id") id: string): Promise<ILine> {
    const line = await this.lineService.getById(id);
    if (!line) {
      throw new BadRequestException(
        "The Line with that Linename could not be found.",
      );
    }
    return line;
  }

  /**
   * Retrieves a Line list
   * @param {FilterLinesPayload} payload
   * @returns {Promise<ILine[]>} queried Line data
   */
  @Post()
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "lines",
    action: "read",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Fetch Lines Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Lines Request Failed" })
  async getLines(@Body() payload: FilterLinesPayload): Promise<{ lines: ILine[]; count: number; }> {
    const { search, sortby, order, offset, limit } = payload
    const lines = await this.lineService.getLineList(search, sortby, order, offset, limit);
    const count = await this.lineService.getLineCount(search);
    if (!lines) {
      throw new BadRequestException(
        "The line with that Linename could not be found.",
      );
    }
    return { lines, count };
  }
  
  /**
   * create Line
   * @param {CreateLinePayload} payload the Line dto
   */
  @Post("create")
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "lines",
    action: "update",
    possession: "any",
  })
  @ApiResponse({ status: 201, description: "Created" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  async register(@Body() payload: CreateLinePayload) {
    return await this.lineService.create(payload);
  }

  /**
   * Edit a Line
   * @param {PatchLinePayload} payload
   * @returns {Promise<ILine>} mutated Line data
   */
  @Patch(':id')
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "lines",
    action: "update",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Patch Line Request Received" })
  @ApiResponse({ status: 400, description: "Patch Line Request Failed" })
  async patchLine(@Param("id") id: string, @Body() payload: PatchLinePayload) {
    return await this.lineService.edit(id, payload);
  }

  /**
   * Removes a Line from the database
   * @param {string} id the id to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the Line has been deleted
   */
  @Delete(":id")
  @UseGuards(AuthGuard("jwt"), ACGuard)
  @UseRoles({
    resource: "lines",
    action: "delete",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Delete Line Request Received" })
  @ApiResponse({ status: 400, description: "Delete Line Request Failed" })
  async delete(
    @Param("id") id: string,
  ): Promise<IGenericMessageBody> {
    return await this.lineService.delete(id);
  }
}