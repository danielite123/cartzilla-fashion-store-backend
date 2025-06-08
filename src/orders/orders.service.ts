import { Injectable, NotFoundException } from '@nestjs/common';
import { CartsService } from 'src/carts/carts.service';
import { PrismaService } from 'src/prisma/prisma.service';
// import { CreateOrderDto } from './dto/Order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private prismaService: PrismaService,
    private cartService: CartsService,
  ) {}

  async createOrder(userId: string) {
    const cart = await this.prismaService.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new NotFoundException('Cart is empty or does not exist');
    }

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    const order = await this.prismaService.order.create({
      data: {
        userId,
        totalPrice,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            size: [item.size],
          })),
        },
      },
      include: { items: true },
    });

    await this.cartService.clearCart(userId);

    return order;
  }
}
