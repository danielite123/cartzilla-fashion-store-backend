import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('add')
  async addToWishlist(
    @Req() req: { userId: string },
    @Body('productId') productId: string,
  ) {
    const userId = req.userId;
    return await this.wishlistService.addToWishlist(userId, productId);
  }

  @Get('get')
  async getWishlist(@Req() req: { userId: string }) {
    const userId = req.userId;
    return await this.wishlistService.getWishlist(userId);
  }

  @Delete('clear')
  async clearWishlist(@Req() req: { userId: string }) {
    const userId = req.userId;
    return await this.wishlistService.clearWishlist(userId);
  }

  @Delete(':itemsId')
  async removeItemFromWishlist(
    @Req() req: { userId: string },
    @Param('itemsId') itemId: string,
  ) {
    const userId = req.userId;
    return await this.wishlistService.removeItemFromWishlist(userId, itemId);
  }

  @Get('items')
  async getWishlistItemsList(@Req() req: { userId: string }) {
    const userId = req.userId;
    return await this.wishlistService.getWishlistItems(userId);
  }

  @Get(':itemsId')
  async getWishlistItems(
    @Req() req: { userId: string },
    @Param('itemsId') itemId: string,
  ) {
    const userId = req.userId;
    return await this.wishlistService.getWishlistItem(userId, itemId);
  }
}
