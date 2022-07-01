import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

/**
 * Refresh Paylaod Class
 */
export class RefreshPayload {
  /**
   * Refresh Token field
   */
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  refreshToken: string;
}