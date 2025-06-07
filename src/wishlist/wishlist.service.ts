import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prismaService: PrismaService) {}

  async addToWishlist(userId: string, productId: string) {
    let wishlist = await this.prismaService.wishlist.findFirst({
      where: { userId },
    });

    if (!wishlist) {
      wishlist = await this.prismaService.wishlist.create({ data: { userId } });
    }

    const existingItem = await this.prismaService.wishlistItem.findFirst({
      where: { wishlistId: wishlist.id, productId },
    });

    if (existingItem) {
      throw new HttpException('Product already in wishlist', 404);
    } else {
      return this.prismaService.wishlistItem.create({
        data: {
          wishlistId: wishlist.id,
          productId,
        },
      });
    }
  }

  async getWishlist(userId: string) {
    const wishlist = await this.prismaService.wishlist.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!wishlist) {
      return null;
    }

    return {
      ...wishlist,
      items: wishlist.items.map((item) => ({
        ...item,
        product: item.product,
      })),
    };
  }

  async removeItemFromWishlist(userId: string, itemId: string) {
    const wishlist = await this.prismaService.wishlist.findFirst({
      where: { userId },
    });

    if (!wishlist) {
      return null;
    }

    return this.prismaService.wishlistItem.delete({
      where: { id: itemId },
    });
  }

  async clearWishlist(userId: string) {
    const wishlist = await this.prismaService.wishlist.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (!wishlist) {
      throw new HttpException('Wishlist not found', 404);
    }

    return this.prismaService.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id },
    });
  }

  async getWishlistItem(userId: string, itemId: string) {
    const wishlist = await this.prismaService.wishlist.findFirst({
      where: { userId },
      include: {
        items: {
          where: { id: itemId },
          include: {
            product: true,
          },
        },
      },
    });

    if (!wishlist || wishlist.items.length === 0) {
      return null;
    }

    return wishlist.items[0];
  }

  async getWishlistItems(userId: string) {
    const wishlist = await this.prismaService.wishlist.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!wishlist || wishlist.items.length === 0) {
      return null;
    }

    return wishlist.items;
  }
}
