import {
  IsString,
  IsUUID,
  IsInt,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  quantity: number;

  @IsInt()
  price: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  size: string[];
}

export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @IsInt()
  totalPrice: number;

  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
