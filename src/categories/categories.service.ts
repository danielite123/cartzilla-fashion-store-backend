import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async createCategory(dto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (existingCategory) {
      throw new BadRequestException('Category with this name already exists');
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
      },
    });
  }

  async getACategoryBy(id: string) {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async getAllCategories() {
    return this.prisma.category.findMany();
  }
}
