import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf } from 'class-validator';
import { Schema } from 'mongoose';

/**
 * Create Manufacturer Payload Class
 */
export class CreateManufacturerPayload {
  /**
   * Name field
   */
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  /**
   * Entity Name field
   */
  @ApiProperty()
  entityName: string;

  /**
   * INN field
   */
  @ApiProperty()
  inn: string;

  /**
   * Description field
   */
  @ApiProperty()
  @IsNotEmpty()
  description: string;

  /**
   * Country field
   */
  @ApiProperty()
  country: string;

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
  logo: string;

  /**
   * Producer field
   */
  @ApiProperty()
  producer: Schema.Types.ObjectId;
}
