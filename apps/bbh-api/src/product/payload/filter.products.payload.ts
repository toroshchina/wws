import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
} from "class-validator";

/**
 * Filter Products Payload Class
 */
export class FilterProductsPayload {
  /**
   * Search field
   */
  @ApiProperty()
  search: string;

  /**
   * SortBy field
   */
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  sortby: string;

  /**
   * Order field
   */
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  order: number;

  /**
   * Offset field
   */
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  offset: number;

  /**
   * Limit field
   */
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  limit: number;
}