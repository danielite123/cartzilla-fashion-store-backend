import { IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  name: string;
}

export class UpdateBrandDto {
  @IsString()
  @IsOptional()
  name?: string;
}
