import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "../config/config.service";
import { UserService } from "../user/user.service";
import { IUser } from "../user/user.model";
import { IToken } from "./token.model";
import { LoginPayload } from "./payload/login.payload";

/**
 * Models a typical Login/Register route return body
 */
export interface ITokenReturnBody {
  /**
   * When the token is to expire in seconds
   */
  expires: string;
  /**
   * A human-readable format of expires
   */
  expiresPrettyPrint: string;
  /**
   * The Access token
   */
  accessToken: string;
  /**
   * The Refresh token
   */
  refreshToken: string;
}

/**
 * Authentication Service
 */
@Injectable()
export class AuthService {
  /**
   * Time in seconds when the token is to expire
   * @type {string}
   */
  private readonly expiration: string;
  private readonly refreshExpiration: string;

  /**
   * Constructor
   * @param {Model<IToken>} tokenModel
   * @param {JwtService} jwtService jwt service
   * @param {ConfigService} configService
   * @param {UserService} userService user service
   */
  constructor(
    @InjectModel("Token") private readonly tokenModel: Model<IToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.expiration = this.configService.get("ACCESS_TOKEN_EXPIRATION_TIME");
    this.refreshExpiration = this.configService.get("REFRESH_TOKEN_EXPIRATION_TIME");
  }

  /**
   * Creates a signed jwt token based on IUser payload
   * @param {User} param dto to generate token from
   * @returns {Promise<ITokenReturnBody>} token body
   */
  async createToken({
    _id,
    username,
    email,
    avatar,
    roles
  }: IUser): Promise<ITokenReturnBody> {
    return {
      expires: this.expiration,
      expiresPrettyPrint: AuthService.prettyPrintSeconds(this.expiration),
      accessToken: this.jwtService.sign({ _id, username, email, avatar, role: roles[0] }),
      refreshToken: await this.createRefreshToken(_id, username, email, avatar, roles[0])
    };
  }

  /**
   * Refresh a signed jwt token by refresh token
   * @param {String} refreshToken refresh token
   * @returns {Promise<ITokenReturnBody>} token body
   */
  async refreshAccessToken(refreshToken: string): Promise<ITokenReturnBody> {
    const token = await this.tokenModel.findOne({ value: refreshToken }).exec();
    if(token) {
      try {
        const { _id, username, email, avatar, role } = this.jwtService.verify(refreshToken);
        return {
          expires: this.expiration,
          expiresPrettyPrint: AuthService.prettyPrintSeconds(this.expiration),
          accessToken: this.jwtService.sign({ _id, username, email, avatar }),
          refreshToken: await this.createRefreshToken(_id, username, email, avatar, role)
        };
      } catch (e) {
        if (e.name === 'TokenExpiredError') {
          throw new UnauthorizedException(
            'Refresh token expired.'
          );
        }
        throw e;
      }
    } else {
      throw new UnauthorizedException(
        'Refresh token does not exist.',
      );
    }
  }

  /**
   * Formats the time in seconds into human-readable format
   * @param {string} time
   * @returns {string} hrf time
   */
  private static prettyPrintSeconds(time: string): string {
    const ntime = Number(time);
    const hours = Math.floor(ntime / 3600);
    const minutes = Math.floor((ntime % 3600) / 60);
    const seconds = Math.floor((ntime % 3600) % 60);

    return `${hours > 0 ? hours + (hours === 1 ? " hour," : " hours,") : ""} ${
      minutes > 0 ? minutes + (minutes === 1 ? " minute" : " minutes") : ""
    } ${seconds > 0 ? seconds + (seconds === 1 ? " second" : " seconds") : ""}`;
  }

  /**
   * Validates whether or not the user exists in the database
   * @param {LoginPayload} payload login payload to authenticate with
   * @returns {Promise<IUser>} registered user
   */
  async validateUser(payload: LoginPayload): Promise<IUser> {
    const user = await this.userService.getByUsernameAndPass(
      payload.username,
      payload.password,
    );
    if (!user) {
      throw new UnauthorizedException(
        "Could not authenticate. Please try again.",
      );
    }
    return user;
  }

  /**
   * Creates refresh token
   * @param {User} param dto to generate token from
   * @returns {Promise<IToken>} refresh token
   */
  private async createRefreshToken(_id, username, email, avatar, role): Promise<string> {
    const refresh = this.jwtService.sign({ _id, username, email, avatar, role }, {
      expiresIn: this.refreshExpiration,
    });
    const token = await this.tokenModel.findOne({ username }).exec();
    if (token) {
      const payload = {value: refresh, username: token.username };
      await this.tokenModel.updateOne(
        { username: token.username },
        payload
      );
      const newToken = await this.tokenModel.findOne({ username }).exec();
      return newToken.value;
    } else {
      const createdToken = new this.tokenModel({
        value: refresh,
        username
      });
      const refreshToken = await createdToken.save();
      return refreshToken.value;
    }
  }
}