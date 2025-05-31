/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Body,
  ParseFilePipe,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService, FileDetail } from './upload.service';
import { UploadApiResponse } from 'cloudinary';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async uploadSingleFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    if (!file) {
      throw new BadRequestException('File is required.');
    }

    const fileDetail: FileDetail = {
      publicId: `uploads/${Date.now()}-${file.originalname}`,
      buffer: file.buffer,
    };

    try {
      return await this.uploadService.uploadFile(fileDetail);
    } catch (error) {
      console.error(`Error in uploadSingleFile controller:`, error);
      throw error;
    }
  }

  @Post('many')
  @UseInterceptors(FilesInterceptor('files', 10))
  @HttpCode(HttpStatus.CREATED)
  async uploadMultipleFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [],
        fileIsRequired: true,
      }),
    )
    files: Array<Express.Multer.File>,
  ): Promise<UploadApiResponse[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one file is required.');
    }

    const filesDetails: FileDetail[] = files.map((file) => ({
      publicId: `uploads/${Date.now()}-${file.originalname}`,
      buffer: file.buffer,
    }));

    try {
      return await this.uploadService.uploadMany(filesDetails);
    } catch (error) {
      console.error('Error in uploadMultipleFiles controller:', error);
      throw error;
    }
  }

  @Delete('/delete/:id')
  deleteImage(@Param('id') id: string) {
    return this.uploadService.deleteImage(id);
  }
}
