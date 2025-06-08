import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/Order.dto';

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

  @Get('user')
  async getUserOrders(@Req() req: { userId: string }) {
    const userId = req.userId;
    return await this.ordersService.getOrdersByUserId(userId);
  }

  @Get(':id')
  async getOrderById(@Param('id') orderId: string) {
    return await this.ordersService.getOrderById(orderId);
  }

  @Patch(':id')
  async updateStatus(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return await this.ordersService.updateOrderStatus(orderId, dto);
  }
}
