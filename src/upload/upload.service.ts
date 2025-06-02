/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { Image } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async uploadMultipleImages(
    files: Express.Multer.File[],
    uploadSessionId?: string,
  ) {
    const sessionId = uploadSessionId || uuidv4();
    const uploadedImages: Image[] = [];

    for (const file of files) {
      try {
        const cloudinaryResponse = await this.cloudinary.uploadFile(file);

        const savedImage: Image = await this.prisma.image.create({
          data: {
            url: cloudinaryResponse.secure_url,
            publicId: cloudinaryResponse.public_id,
            uploadSessionId: sessionId,
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
    return {
      sessionId,
      uploadedImages,
    };
  }

  async uploadSingleImage(file: Express.Multer.File) {
    try {
      const cloudinaryResponse = await this.cloudinary.uploadFile(file);

      const savedImage: Image = await this.prisma.image.create({
        data: {
          url: cloudinaryResponse.secure_url,
          publicId: cloudinaryResponse.public_id,
        },
      });

      return {
        uploadedImage: savedImage,
      };
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

  async deleteImage(id: string) {
    const image = await this.prisma.image.findUnique({ where: { id } });
    if (!image) {
      throw new NotFoundException(`Image with id ${id} not found`);
    }

    await new Promise<void>((resolve, reject) => {
      cloudinary.uploader.destroy(image.publicId, (error, result) => {
        if (error) {
          console.error('Cloudinary delete error:', error);
          return reject(
            new InternalServerErrorException(
              `Failed to delete image from Cloudinary: ${error.message}`,
            ),
          );
        }
        if (result.result !== 'ok' && result.result !== 'not found') {
          return reject(
            new InternalServerErrorException(
              `Cloudinary delete failed: ${result.result}`,
            ),
          );
        }
        resolve();
      });
    });

    return this.prisma.image.delete({ where: { id } });
  }
}
