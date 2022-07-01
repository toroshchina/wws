import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { Schema } from 'mongoose';

/**
 * Create Line Payload Class
 */
export class CreateLinePayload {
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
