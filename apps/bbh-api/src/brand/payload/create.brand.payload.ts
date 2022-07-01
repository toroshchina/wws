import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

/**
 * Create Brand Payload Class
 */
export class CreateBrandPayload {
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
   * Strength field
   */
  @ApiProperty()
  strength: string;

  /**
   * Username Create field
   */
  @ApiProperty()
  @IsNotEmpty()
  usernameCreate: string;

  /**
   * Username Update field
   */
  @ApiProperty()
  @IsNotEmpty()
  usernameUpdate: string;

  /**
   * Date Create field
   */
  @ApiProperty()
  @IsNotEmpty()
  dateCreate: string;

  /**
   * Date Update field
   */
  @ApiProperty()
  @IsNotEmpty()
  dateUpdate: string;

  /**
   * Logo field
   */
  @ApiProperty()
  @IsOptional()
  logo: string;
}
