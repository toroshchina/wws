import { ApiProperty } from '@nestjs/swagger';
import { Schema } from 'mongoose';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

/**
 * Patch Upload Payload Class
 */
export class PatchUploadPayload {
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
  description: string;

  /**
   * Taste field
   */
  @ApiProperty()
  tastes: string[];

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

  /**
   * Line field
   */
  @ApiProperty()
  line: Schema.Types.ObjectId;

  /**
   * Brand field
   */
  @ApiProperty()
  brand: Schema.Types.ObjectId;
}
