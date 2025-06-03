import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/Product.dto';

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
        brandId: dto.brandId,
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

  async getAllProducts() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        images: true,
        colorVariants: true,
      },
    });
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        colorVariants: true,
      },
    });

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    return product;
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        washingInstruction: dto.washingInstruction,
        price: dto.price,
        stock: dto.stock,
        size: dto.size,
        categoryId: dto.categoryId,
        brandId: dto.brandId,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return updatedProduct;
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    await this.prisma.product.delete({ where: { id } });
  }

  async getProductsByCategory(categoryId: string) {
    return this.prisma.product.findMany({
      where: { categoryId },
      include: {
        category: true,
        images: true,
        colorVariants: true,
      },
    });
  }

  async getProductsByBrand(brandId: string) {
    return this.prisma.product.findMany({
      where: { brandId },
      include: {
        category: true,
        images: true,
        colorVariants: true,
      },
    });
  }
}
