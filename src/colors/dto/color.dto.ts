// src/color-variant/dto/create-color-variant.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsHexColor,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class CreateColorVariantDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsHexColor()
  hex: string;

  @IsUUID()
  imageId: string;

  @IsOptional()
  @IsString()
  colorSessionId?: string;
}

export class UpdateColorVariantDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsHexColor()
  hex?: string;

  @IsOptional()
  @IsUUID()
  imageId?: string;
}
