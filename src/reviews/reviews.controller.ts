import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/Reviews.dto';
import { SkipAuth } from 'src/guards/auth.decorator';

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

  @Post(':productId/reply/:parentReviewId')
  async replyToReview(
    @Req() req: { userId: string },
    @Param('productId') productId: string,
    @Param('parentReviewId') parentReviewId: string,
    @Body('comment') comment: string,
  ) {
    const userId = req.userId;
    return await this.reviewsService.replyToReview(
      parentReviewId,
      productId,
      userId,
      comment,
    );
  }

  @SkipAuth()
  @Get(':productId')
  async getReviewsByProductId(@Param('productId') productId: string) {
    return await this.reviewsService.getReviewsByProductId(productId);
  }

  @SkipAuth()
  @Get(':productId/rating')
  async getRatingSummary(@Param('productId') productId: string) {
    return await this.reviewsService.getRatingSummary(productId);
  }
}
