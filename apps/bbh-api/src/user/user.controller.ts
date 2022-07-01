import {
  BadRequestException, Body, Controller, Delete,
  Get, Post, Param, Patch, UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ACGuard, UseRoles } from "nest-access-control";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserService, IGenericMessageBody } from "./user.service";
import { PatchUserPayload } from "./payload/patch.user.payload";
import { PatchUserPasswordPayload } from "./payload/patch.user-password.payload";
import { IUser } from "./user.model";
import { FilterUsersPayload } from './payload/filter.users.payload';

/**
 * User Controller
 */
@ApiBearerAuth()
@ApiTags("user")
@Controller("api/user")
export class UserController {
  /**
   * Constructor
   * @param userService
   */
  constructor(private readonly userService: UserService) { }

  /**
   * Retrieves a particular user
   * @param username the user given username to fetch
   * @returns {Promise<IUser>} queried user data
   */
  @Get(":username")
  @UseGuards(AuthGuard("jwt"))
  @ApiResponse({ status: 200, description: "Fetch User Request Received" })
  @ApiResponse({ status: 400, description: "Fetch User Request Failed" })
  async getUser(@Param("username") username: string): Promise<IUser> {
    const user = await this.userService.getByUsername(username);
    if (!user) {
      throw new BadRequestException(
        "The user with that username could not be found.",
      );
    }
    return user;
  }

  /**
   * Retrieves a user list
   * @param {FilterUsersPayload} payload
   * @returns {Promise<IUser[]>} queried user data
   */
  @Post()
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "list",
    action: "read",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Fetch Users Request Received" })
  @ApiResponse({ status: 400, description: "Fetch Users Request Failed" })
  async getUsers(@Body() payload: FilterUsersPayload): Promise<{ users: IUser[]; count: number; }> {
    const { search, sortby, order, offset, limit } = payload
    const users = await this.userService.getUserList(search, sortby, order, offset, limit);
    const count = await this.userService.getUserCount(search);
    if (!users) {
      throw new BadRequestException(
        "The user with that username could not be found.",
      );
    }
    return { users, count };
  }

  /**
   * Edit a user
   * @param {PatchUserPayload} payload
   * @returns {Promise<IUser>} mutated user data
   */
  @Patch(':username')
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "users",
    action: "update",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Patch User Request Received" })
  @ApiResponse({ status: 400, description: "Patch User Request Failed" })
  async patchUser(@Body() payload: PatchUserPayload) {
    return await this.userService.edit(payload);
  }

  /**
   * Edit a users password
   * @param {PatchUserPasswordPayload} payload
   * @returns {Promise<IUser>} mutated user data
   */
  @Patch(":username/password")
  @UseGuards(AuthGuard("jwt"))
  @UseRoles({
    resource: "users",
    action: "update",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Patch User Request Received" })
  @ApiResponse({ status: 400, description: "Patch User Request Failed" })
  async patchUserPassword(@Body() payload: PatchUserPasswordPayload) {
    return await this.userService.editPassword(payload);
  }

  /**
   * Removes a user from the database
   * @param {string} username the username to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the user has been deleted
   */
  @Delete(":username")
  @UseGuards(AuthGuard("jwt"), ACGuard)
  @UseRoles({
    resource: "users",
    action: "delete",
    possession: "any",
  })
  @ApiResponse({ status: 200, description: "Delete User Request Received" })
  @ApiResponse({ status: 400, description: "Delete User Request Failed" })
  async delete(
    @Param("username") username: string,
  ): Promise<IGenericMessageBody> {
    return await this.userService.delete(username);
  }
}