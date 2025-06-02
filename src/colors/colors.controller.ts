import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorVariantDto } from './dto';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post('create')
  createColor(@Body() dto: CreateColorVariantDto) {
    return this.colorsService.createColorVariants(dto);
  }

  @Delete('delete/:id')
  async deleteColor(@Param('id') id: string) {
    return this.colorsService.deleteColorVariant(id);
  }

  @Get(':id')
  async getColor(@Param('id') id: string) {
    return this.colorsService.getColorVariant(id);
  }
}
