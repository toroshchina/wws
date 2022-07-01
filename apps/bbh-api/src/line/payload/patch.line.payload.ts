import { ApiProperty } from '@nestjs/swagger';
import { Schema } from 'mongoose';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

/**
 * Patch Line Payload Class
 */
export class PatchLinePayload {
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
   * Brand field
   */
  @ApiProperty()
  brand: Schema.Types.ObjectId;

  /**
   * Strength field
   */
  @ApiProperty()
  @IsOptional()
  strength: string;

  /**
   * Taste field
   */
  @ApiProperty()
  @IsOptional()
  taste: string[];

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
