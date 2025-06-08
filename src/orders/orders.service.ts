import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartsService } from 'src/carts/carts.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(
    private prismaService: PrismaService,
    private cartService: CartsService,
  ) {}

  async createOrder(userId: string) {
    try {
      const cart = await this.prismaService.cart.findFirst({
        where: { userId },
        include: {
          items: {
            include: { product: true },
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
    } catch (error) {
      throw new HttpException(
        `Failed to create order: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllOrders() {
    try {
      const orders = await this.prismaService.orderItem.findMany({
        include: {
          order: true,
          product: true,
        },
      });
      return orders;
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve orders: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderById(orderId: string) {
    try {
      const order = await this.prismaService.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      return order;
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve order: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
