import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { AddToCart } from './dto/Cart.dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartService: CartsService) {}

  @Post('add')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addToCart(@Req() req: { userId: string }, @Body() dto: AddToCart) {
    const userId = req.userId;
    return await this.cartService.addToCart(
      userId,
      dto.productId,
      dto.quantity,
      dto.size,
    );
  }

  @Get('get')
  async getCart(@Req() req: { userId: string }) {
    const userId = req.userId;
    return await this.cartService.getCart(userId);
  }

  @Delete(':itemId')
  async removeItemFromCart(
    @Req() req: { userId: string },
    @Param() dto: { itemId: string },
  ) {
    const userId = req.userId;
    return await this.cartService.removeItemFromCart(userId, dto.itemId);
  }

  @Delete('clear')
  async clearCart(@Req() req: { userId: string }) {
    const userId = req.userId;
    return await this.cartService.clearCart(userId);
  }

  @Get('count')
  async getCartCount(@Req() req: { userId: string }) {
    const userId = req.userId;
    return await this.cartService.getCartItemCount(userId);
  }

  @Get('total')
  async getCartTotal(@Req() req: { userId: string }) {
    const userId = req.userId;
    return await this.cartService.getCartTotal(userId);
  }

  @Get('items')
  async getCartItems(@Req() req: { userId: string }) {
    const userId = req.userId;
    return await this.cartService.getCartItems(userId);
  }
}
