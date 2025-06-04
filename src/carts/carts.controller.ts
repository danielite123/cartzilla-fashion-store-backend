import {
  Body,
  Controller,
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
}
