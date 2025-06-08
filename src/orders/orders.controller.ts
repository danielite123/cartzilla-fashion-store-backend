import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('create')
  async createOrder(@Req() req: { userId: string }) {
    const userId = req.userId;
    return await this.ordersService.createOrder(userId);
  }

  @Get('all')
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return await this.ordersService.getOrderById(id);
  }
}
