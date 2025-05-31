// src/products/dto/Product.dto.ts
import { IsString, IsInt, IsArray, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  washingInstruction: string;

  @IsNumber()
  price: number;

  @IsInt()
  stock: number;

  @IsArray()
  @IsString({ each: true })
  size: string[];
}
