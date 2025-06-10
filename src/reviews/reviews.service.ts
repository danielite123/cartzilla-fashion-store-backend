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
}
