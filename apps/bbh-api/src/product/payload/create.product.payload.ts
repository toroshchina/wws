import { ApiProperty } from '@nestjs/swagger';
import { Schema } from 'mongoose';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * Create Product Payload Class
 */
export class CreateProductPayload {
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
