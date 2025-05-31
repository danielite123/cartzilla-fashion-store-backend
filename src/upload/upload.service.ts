/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
import { PrismaService } from 'src/prisma/prisma.service';
import { Readable } from 'stream';

export interface FileDetail {
  publicId: string;
  buffer: Buffer;
}

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {
    const cloudName = process.env.CLOUDINARY_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.error(
        'Cloudinary environment variables are not fully configured. Uploads will fail.',
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  private async uploadOneFile(
    publicId: string,
    fileBuffer: Buffer,
  ): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      if (
        !cloudinary.config().cloud_name ||
        !cloudinary.config().api_key ||
        !cloudinary.config().api_secret
      ) {
        console.error('Cloudinary is not configured. Cannot upload file.');
        return reject(
          new InternalServerErrorException(
            'Cloudinary service is not configured.',
          ),
        );
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: 'auto',
          overwrite: true,
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            console.error(
              `Cloudinary Upload Error for public_id "${publicId}":`,
              error.message,
            );
            return reject(
              new InternalServerErrorException(
                `Cloudinary upload failed for "${publicId}": ${error.message}`,
              ),
            );
          }
          if (result) {
            resolve(result);
          } else {
            console.error(
              `Cloudinary Upload Error: No result and no error returned for public_id "${publicId}".`,
            );
            reject(
              new InternalServerErrorException(
                `Cloudinary upload failed for "${publicId}": Unknown error, no result or error object returned.`,
              ),
            );
          }
        },
      );

      const readableStream = new Readable();
      readableStream._read = () => {};
      readableStream.push(fileBuffer);
      readableStream.push(null);

      readableStream.pipe(uploadStream);
    });
  }

  async uploadFile(fileDetail: FileDetail): Promise<UploadApiResponse> {
    if (!fileDetail || !fileDetail.publicId || !fileDetail.buffer) {
      throw new InternalServerErrorException();
    }

    const result = await this.uploadOneFile(
      fileDetail.publicId,
      fileDetail.buffer,
    );

    await this.prisma.image.create({
      data: {
        url: result.secure_url,
        publicId: fileDetail.publicId,
      },
    });

    return result;
  }

  async uploadMany(files: FileDetail[]): Promise<UploadApiResponse[]> {
    if (!files || files.length === 0) {
      return [];
    }

    for (const fileDetail of files) {
      if (!fileDetail || !fileDetail.publicId || !fileDetail.buffer) {
        throw new InternalServerErrorException(
          'Invalid file detail found in the array for bulk upload.',
        );
      }
    }

    const uploadPromises: Promise<UploadApiResponse>[] = files.map(
      (fileDetail) =>
        this.uploadOneFile(fileDetail.publicId, fileDetail.buffer),
    );

    try {
      const results = await Promise.all(uploadPromises);

      // Save all URLs in Prisma with a transaction
      await this.prisma.$transaction(
        results.map((res, idx) =>
          this.prisma.image.create({
            data: { url: res.secure_url, publicId: files[idx].publicId },
          }),
        ),
      );

      return results;
    } catch (error) {
      console.error('Error during bulk upload to Cloudinary:', error);

      if (error instanceof Error) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred during bulk file upload.',
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

  findImageById(id: string) {
    return this.prisma.image.findUnique({
      where: { id },
    });
  }
}
