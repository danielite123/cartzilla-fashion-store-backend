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

      const trackingNumber = await this.generateUniqueTrackingNumber();

      const order = await this.prismaService.order.create({
        data: {
          userId,
          totalPrice,
          trackingNumber,
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

  async generateUniqueTrackingNumber(): Promise<string> {
    let trackingNumber = '';
    let exists = true;

    while (exists) {
      trackingNumber = Array.from({ length: 11 }, () => {
        const pool =
          Math.random() < 0.7 ? '0123456789' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return pool.charAt(Math.floor(Math.random() * pool.length));
      }).join('');

      const existing = await this.prismaService.order.findFirst({
        where: { trackingNumber },
        select: { id: true },
      });

      exists = !!existing;
    }

    return trackingNumber;
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

  async getOrdersByUserId(userId: string) {
    try {
      const orders = await this.prismaService.order.findMany({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!orders || orders.length === 0) {
        throw new NotFoundException('No orders found for this user');
      }

      return orders;
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve orders for user: ${error}`,
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
