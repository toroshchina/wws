import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

// you can add validate using class-validator
export class CreateUploadPayload {
  @ApiProperty({ type: Array, format: 'binary' })
  photo_url: string[];
  /**
   * Username Create field
   */
  @ApiProperty()
  @IsNotEmpty()
  usernameCreate: string;

  /**
   * Date Create field
   */
  @ApiProperty()
  @IsNotEmpty()
  dateCreate: string;
}
