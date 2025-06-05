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

  async getCart(userId: string) {
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

    if (!cart) {
      return null;
    }

    return {
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          price: item.product.price.toString(),
        },
      })),
    };
  }

  async removeItemFromCart(userId: string, itemId: string) {
    const cart = await this.prismaService.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    const item = await this.prismaService.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      throw new Error('Item not found in cart');
    }

    return this.prismaService.cartItem.delete({ where: { id: itemId } });
  }

  async clearCart(userId: string) {
    const cart = await this.prismaService.cart.findFirst({
      where: { userId },
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    return this.prismaService.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }

  async getCartItemCount(userId: string) {
    const cart = await this.prismaService.cart.findFirst({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      return 0;
    }

    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  async getCartTotal(userId: string) {
    const cart = await this.prismaService.cart.findFirst({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) {
      return 0;
    }

    return cart.items.reduce((total, item) => {
      const price = item.product.price * item.quantity;
      return total + price;
    }, 0);
  }

  async getCartItems(userId: string) {
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

    if (!cart) {
      return [];
    }

    return cart.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: item.product.price.toString(),
      },
    }));
  }
}
