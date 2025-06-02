import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/Product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        washingInstruction: dto.washingInstruction,
        price: dto.price,
        stock: dto.stock,
        size: dto.size,
        categoryId: dto.categoryId,
      },
      include: {
        category: true,
        images: true,
      },
    });

    if (dto.uploadSessionId) {
      await this.prisma.image.updateMany({
        where: {
          uploadSessionId: dto.uploadSessionId,
          productId: null,
        },
        data: {
          productId: product.id,
        },
      });
    }

    if (dto.colorSessionId) {
      await this.prisma.colorVariant.updateMany({
        where: {
          colorSessionId: dto.colorSessionId,
          productId: null,
        },
        data: {
          productId: product.id,
        },
      });
    }

    const productWithImages = await this.prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        images: true,
        colorVariants: true,
      },
    });

    return productWithImages;
  }
}
