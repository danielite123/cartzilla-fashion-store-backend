import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  rating: number;

  @IsString()
  @MinLength(3)
  comment: string;
}
