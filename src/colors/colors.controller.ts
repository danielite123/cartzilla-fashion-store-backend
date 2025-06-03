import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorVariantDto } from './dto';
import { AdminAuthGuard } from 'src/guards/admin/admin.guard';
import { AuthenticateAdmin } from 'src/guards/admin/admin-auth.decorator';

@UseGuards(AdminAuthGuard)
@AuthenticateAdmin()
@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post('create')
  createColor(@Body() dto: CreateColorVariantDto[]) {
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
