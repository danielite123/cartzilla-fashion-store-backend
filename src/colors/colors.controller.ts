import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorVariantDto, UpdateColorVariantDto } from './dto';
import { AdminAuthGuard } from 'src/guards/admin/admin.guard';
import { AuthenticateAdmin } from 'src/guards/admin/admin-auth.decorator';
import { SkipAuth } from 'src/guards/auth.decorator';

@UseGuards(AdminAuthGuard)
@AuthenticateAdmin()
@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post('create')
  createColor(@Body() dto: CreateColorVariantDto[]) {
    return this.colorsService.createColorVariants(dto);
  }

  @Patch('update/:id')
  async updateColor(
    @Param('id') id: string,
    @Body() dto: UpdateColorVariantDto,
  ) {
    return this.colorsService.updateColorVariant(id, dto);
  }

  @Delete('delete/:id')
  async deleteColor(@Param('id') id: string) {
    return this.colorsService.deleteColorVariant(id);
  }

  @SkipAuth()
  @Get('all')
  async getAllColors() {
    return this.colorsService.getAllColorVariants();
  }

  @SkipAuth()
  @Get(':id')
  async getColor(@Param('id') id: string) {
    return this.colorsService.getColorVariant(id);
  }
}
