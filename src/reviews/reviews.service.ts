import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/Reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(private prismaService: PrismaService) {}

  async createReview(userId: string, productId: string, dto: CreateReviewDto) {
    try {
      const userOrdered = await this.prismaService.orderItem.findFirst({
        where: {
          productId: productId,
          order: {
            userId: userId,
            status: 'COMPLETED',
          },
        },
      });

      const isVerified = userOrdered ? true : false;

      const review = await this.prismaService.review.create({
        data: {
          rating: dto.rating,
          comment: dto.comment,
          productId: productId,
          userId: userId,
          isVerified: isVerified,
        },
      });

      return review;
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve order: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async replyToReview(
    parentReviewId: string,
    productId: string,
    userId: string,
    comment: string,
  ) {
    try {
      const parent = await this.prismaService.review.findUnique({
        where: { id: parentReviewId },
      });

      if (!parent || parent.productId !== productId) {
        throw new Error('Invalid parent review');
      }

      const reply = await this.prismaService.review.create({
        data: {
          comment: comment,
          rating: 0,
          isVerified: false,
          productId: productId,
          userId: userId,
          parentReviewId: parentReviewId,
        },
      });

      return reply;
    } catch (error) {
      throw new HttpException(
        `Failed to reply to review: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getReviewsByProductId(productId: string) {
    try {
      const reviews = await this.prismaService.review.findMany({
        where: { productId: productId },
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                },
              },
            },
          },
        },
      });

      if (!reviews || reviews.length === 0) {
        throw new HttpException(
          'No reviews found for this product',
          HttpStatus.NOT_FOUND,
        );
      }

      return reviews;
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve reviews for product ${productId}: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRatingSummary(productId: string) {
    try {
      const reviews = await this.prismaService.review.findMany({
        where: { productId },
        select: { rating: true },
      });

      if (!reviews.length) {
        throw new HttpException(
          'No verified reviews found for this product',
          HttpStatus.NOT_FOUND,
        );
      }

      const totalReviews = reviews.length;
      const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let totalRating = 0;

      reviews.forEach(({ rating }) => {
        totalRating += rating;
        if (breakdown[rating] !== undefined) {
          breakdown[rating]++;
        }
      });

      const averageRating = parseFloat((totalRating / totalReviews).toFixed(2));

      return {
        averageRating,
        totalReviews,
        ratingsBreakdown: breakdown,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve rating summary for product ${productId}: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
