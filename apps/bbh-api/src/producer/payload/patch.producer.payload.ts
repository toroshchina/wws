import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf } from 'class-validator';

/**
 * Patch Producer Payload Class
 */
export class PatchProducerPayload {
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
}
