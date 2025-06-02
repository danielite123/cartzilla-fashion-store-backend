import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateColorVariantDto } from './dto';
import { UploadService } from 'src/upload/upload.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ColorsService {
  constructor(
    private prisma: PrismaService,
    private imageService: UploadService,
  ) {}

  async createColorVariants(
    dto: CreateColorVariantDto,
    colorSessionId?: string,
  ) {
    const sessionId = colorSessionId || uuidv4();

    const colorImage = await this.prisma.image.findUnique({
      where: { id: dto.imageId },
    });

    if (!colorImage) {
      throw new NotFoundException('Image not found');
    }

    return this.prisma.colorVariant.create({
      data: { ...dto, colorSessionId: sessionId },
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
