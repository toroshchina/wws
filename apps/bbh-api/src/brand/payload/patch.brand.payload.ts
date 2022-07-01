import { ApiProperty } from '@nestjs/swagger';
import { Schema } from 'mongoose';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

/**
 * Patch Brand Payload Class
 */
export class PatchBrandPayload {
  /**
   * Name field
   */
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  /**
   * Description field
   */
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  /**
   * Manufacturer field
   */
  @ApiProperty()
  @IsNotEmpty()
  manufacturer: Schema.Types.ObjectId;

  /**
   * Strength field
   */
  @ApiProperty()
  strength: string;

  /**
   * Username Update field
   */
  @ApiProperty()
  @IsNotEmpty()
  usernameUpdate: string;

  /**
   * Date Update field
   */
  @ApiProperty()
  @IsNotEmpty()
  dateUpdate: Date;

  /**
   * Logo field
   */
  @ApiProperty()
  @IsOptional()
  logo: string;
}
