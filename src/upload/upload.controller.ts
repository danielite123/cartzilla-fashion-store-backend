// src/image/image.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Body,
  Delete,
  Param,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly imageService: UploadService) {}

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadMultipleImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: true,
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    console.log(
      'Received files:',
      files.map((f) => f.originalname),
    );

    return this.imageService.uploadMultipleImages(files);
  }

  @Post('upload-single')
  @UseInterceptors(FileInterceptor('file'))
  uploadSingleImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log('Received file:', file.originalname);
    return this.imageService.uploadSingleImage(file);
  }

  @Delete('/delete/:id')
  deleteImage(@Param('id') id: string) {
    return this.imageService.deleteImage(id);
  }
}
