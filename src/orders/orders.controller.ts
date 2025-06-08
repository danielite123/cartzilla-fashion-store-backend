import { Controller, Post, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('create')
  async createOrder(@Req() req: { userId: string }) {
    const userId = req.userId;
    return await this.ordersService.createOrder(userId);
  }
}
