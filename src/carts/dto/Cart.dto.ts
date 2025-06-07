import { IsInt, IsString } from 'class-validator';

export class AddToCart {
  @IsString()
  productId: string;

  @IsInt()
  quantity: number;

  @IsString()
  size: string;
}
