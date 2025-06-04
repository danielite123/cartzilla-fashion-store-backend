/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartsService {
  constructor(private prismaService: PrismaService) {}

  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
    size: string,
  ) {
    let cart = await this.prismaService.cart.findFirst({ where: { userId } });

    if (!cart) {
      cart = await this.prismaService.cart.create({ data: { userId } });
    }

    const existingItem = await this.prismaService.cartItem.findFirst({
      where: { cartId: cart.id, productId, size },
    });

    if (existingItem) {
      return this.prismaService.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity, size },
      });
    } else {
      return this.prismaService.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          size,
        },
      });
    }
  }
}
