import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async createBrand(dto: CreateBrandDto) {
    const existingBrand = await this.prisma.brand.findUnique({
      where: { name: dto.name },
    });

    if (existingBrand) {
      throw new BadRequestException('Brand with this name already exists');
    }

    return this.prisma.brand.create({
      data: {
        name: dto.name,
      },
    });
  }

  async getABrand(id: string) {
    return this.prisma.brand.findUnique({
      where: {
        id,
      },
    });
  }

  async updateBrand(id: string, data: UpdateBrandDto) {
    const findBrand = await this.getABrand(id);

    if (!findBrand) throw new HttpException('Brand not found', 404);

    if (data.name) {
      const brandExist = await this.prisma.brand.findUnique({
        where: { name: data.name },
      });

      if (brandExist) throw new HttpException('Brand already exist', 404);
    }

    return this.prisma.brand.update({ where: { id }, data });
  }

  async deleteBrand(id: string) {
    const findBrand = await this.getABrand(id);

    if (!findBrand) throw new HttpException('Brand not found', 404);

    return this.prisma.brand.delete({ where: { id } });
  }

  async getAllBrands() {
    return this.prisma.brand.findMany();
  }
}
