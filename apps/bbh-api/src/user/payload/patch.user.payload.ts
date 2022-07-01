import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsAlphanumeric,
  Matches,
  IsUrl,
} from "class-validator";
import { AppRoles } from "../../app/app.roles";

/**
 * Patch User Payload Class
 */
export class PatchUserPayload {
  /**
   * Email field
   */
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Roles field
   */
  @ApiProperty()
  @IsNotEmpty()
  roles: AppRoles;

  /**
   * Username field
   */
  @ApiProperty({
    required: true,
  })
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;

  /**
   * Name field
   */
  @ApiProperty()
  @Matches(/^[a-zA-Zа-яА-ЯёЁ ]+$/)
  @IsNotEmpty()
  name: string;

  /**
   * Avatar field
   */
  @ApiProperty()
  @IsUrl()
  avatar: string;
}