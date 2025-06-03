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
import { BrandsService } from './brands.service';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { AdminAuthGuard } from 'src/guards/admin/admin.guard';
import { AuthenticateAdmin } from 'src/guards/admin/admin-auth.decorator';
import { SkipAuth } from 'src/guards/auth.decorator';

@UseGuards(AdminAuthGuard)
@AuthenticateAdmin()
@Controller('brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Post('create')
  async createBrand(@Body() dto: CreateBrandDto) {
    return this.brandsService.createBrand(dto);
  }

  @SkipAuth()
  @Get('all')
  async getAllBrands() {
    return this.brandsService.getAllBrands();
  }

  @SkipAuth()
  @Get(':id')
  async getABrand(@Param('id') id: string) {
    return this.brandsService.getABrand(id);
  }

  @Patch(':id/update')
  async updateBrand(@Param('id') id: string, @Body() data: UpdateBrandDto) {
    return this.brandsService.updateBrand(id, data);
  }

  @Delete(':id/delete')
  async deleteBrand(@Param('id') id: string) {
    return this.brandsService.deleteBrand(id);
  }
}
