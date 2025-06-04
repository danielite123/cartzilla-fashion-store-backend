import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @IsString()
  productId: string;

  @IsString()
  size: string;

  @IsInt()
  quantity: number;
}

export class CreateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}

export class AddToCart {
  @IsString()
  productId: string;

  @IsInt()
  quantity: number;

  @IsString()
  size: string;
}
