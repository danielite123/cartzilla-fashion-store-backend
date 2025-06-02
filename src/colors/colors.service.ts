import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateColorVariantDto } from './dto';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class ColorsService {
  constructor(
    private prisma: PrismaService,
    private imageService: UploadService,
  ) {}

  async createColorVariants(
    dto: CreateColorVariantDto | CreateColorVariantDto[],
  ) {
    if (Array.isArray(dto)) {
      const imageIds = dto.map((d) => d.imageId);
      const images = await this.prisma.image.findMany({
        where: { id: { in: imageIds } },
      });

      if (images.length !== dto.length) {
        throw new NotFoundException('One or more image IDs are invalid');
      }

      return this.prisma.colorVariant.createMany({
        data: dto,
        skipDuplicates: true,
      });
    }

    const colorImage = await this.prisma.image.findUnique({
      where: { id: dto.imageId },
    });

    if (!colorImage) {
      throw new NotFoundException('Image not found');
    }

    return this.prisma.colorVariant.create({
      data: dto,
    });
  }

  async deleteColorVariant(id: string) {
    const color = await this.prisma.colorVariant.findUnique({ where: { id } });

    if (!color) {
      throw new NotFoundException(`ColorVariant with id ${id} not found`);
    }

    await this.prisma.colorVariant.delete({ where: { id } });
    return this.imageService.deleteImage(color.imageId);
  }

  async getColorVariant(id: string) {
    const color = await this.prisma.colorVariant.findUnique({ where: { id } });

    if (!color) {
      throw new NotFoundException(`ColorVariant with id ${id} not found`);
    }

    return this.prisma.colorVariant.findUnique({ where: { id } });
  }
}
