/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { Image } from '@prisma/client';

@Injectable()
export class UploadService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async uploadMultipleImages(files: Express.Multer.File[]) {
    const uploadedImages: Image[] = [];

    for (const file of files) {
      try {
        const cloudinaryResponse = await this.cloudinary.uploadFile(file);

        const savedImage: Image = await this.prisma.image.create({
          data: {
            url: cloudinaryResponse.secure_url,
            publicId: cloudinaryResponse.public_id,
          },
        });
        uploadedImages.push(savedImage);
      } catch (error) {
        console.error(
          `Failed to upload or save image: ${file.originalname}`,
          error,
        );
        throw new InternalServerErrorException(
          `Failed to process image ${file.originalname}. Error: ${error.message}`,
        );
      }
    }
    return uploadedImages;
  }
}
