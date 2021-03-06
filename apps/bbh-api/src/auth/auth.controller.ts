import { Controller, Body, Post } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService, ITokenReturnBody } from "./auth.service";
import { LoginPayload, RefreshPayload, RegisterPayload } from "./payload";
import { UserService } from "../user/user.service";

/**
 * Authentication Controller
 */
@Controller("api/auth")
@ApiTags("authentication")
export class AuthController {
  /**
   * Constructor
   * @param {AuthService} authService authentication service
   * @param {UserService} userService user service
   */
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  /**
   * Login route to validate and create tokens for users
   * @param {LoginPayload} payload the login dto
   */
  @Post("login")
  @ApiResponse({ status: 201, description: "Login Completed" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async login(@Body() payload: LoginPayload): Promise<ITokenReturnBody> {
    const user = await this.authService.validateUser(payload);
    return await this.authService.createToken(user);
  }

  /**
   * Registration route to create and generate tokens for users
   * @param {RegisterPayload} payload the registration dto
   */
  @Post("register")
  @ApiResponse({ status: 201, description: "Registration Completed" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 406, description: "User already exists" })
  async register(@Body() payload: RegisterPayload): Promise<ITokenReturnBody> {
    const user = await this.userService.create(payload);
    return await this.authService.createToken(user);
  }

  /**
   * Refresh route to refresh tokens for users
   * @param {RefreshPayload} payload the refresh dto
   */
  @Post("refresh")
  @ApiResponse({ status: 201, description: "Access token refreshed" })
  @ApiResponse({ status: 400, description: "Bad Request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async refresh(@Body() payload: RefreshPayload): Promise<ITokenReturnBody> {
    return await this.authService.refreshAccessToken(payload.refreshToken);
  }
}