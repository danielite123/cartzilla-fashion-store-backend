import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
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

  async updateCatgory(id: string, data: UpdateCategoryDto) {
    const findCategory = await this.getACategoryBy(id);

    if (!findCategory) throw new HttpException('Category not found', 404);

    if (data.name) {
      const categoryExist = await this.prisma.category.findUnique({
        where: { name: data.name },
      });

      if (categoryExist) throw new HttpException('Category already exist', 404);
    }

    return this.prisma.category.update({ where: { id }, data });
  }

  async deleteCatgory(id: string) {
    const findCategory = await this.getACategoryBy(id);

    if (!findCategory) throw new HttpException('Category not found', 404);

    return this.prisma.category.delete({ where: { id } });
  }

  async getAllCategories() {
    return this.prisma.category.findMany();
  }
}
