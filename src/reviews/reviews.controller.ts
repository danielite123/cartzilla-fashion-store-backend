import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/Reviews.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post(':productId')
  async createReview(
    @Req() req: { userId: string },
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
  ) {
    const userId = req.userId;
    return await this.reviewsService.createReview(userId, productId, dto);
  }
}
