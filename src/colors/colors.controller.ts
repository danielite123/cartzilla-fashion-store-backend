import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorVariantDto } from './dto';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post('create')
  createColor(@Body() dto: CreateColorVariantDto) {
    return this.colorsService.create(dto);
  }

  @Delete('delete/:id')
  async deleteColor(@Param('id') id: string) {
    return this.colorsService.delete(id);
  }
}
