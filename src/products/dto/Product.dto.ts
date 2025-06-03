// src/products/dto/Product.dto.ts
import {
  IsString,
  IsInt,
  IsArray,
  IsNumber,
  IsUUID,
  IsOptional,
} from 'class-validator';

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

  @IsUUID()
  categoryId: string;

  @IsUUID()
  brandId: string;

  @IsOptional()
  @IsString()
  uploadSessionId?: string;

  @IsOptional()
  @IsString()
  colorSessionId?: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  washingInstruction?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  size?: string[];

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  brandId?: string;

  @IsOptional()
  @IsString()
  uploadSessionId?: string;

  @IsOptional()
  @IsString()
  colorSessionId?: string;
}
