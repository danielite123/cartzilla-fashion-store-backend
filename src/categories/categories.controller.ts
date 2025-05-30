import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Post('create')
  @UseGuards(AuthGuard, AdminGuard)
  createCategory(@Body() data: CreateCategoryDto) {
    return this.categoryService.createCategory(data);
  }

  @Get('all')
  @UseGuards(AuthGuard, AdminGuard)
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  @UseGuards(AuthGuard, AdminGuard)
  async getACategory(@Param('id') id: string) {
    const category = await this.categoryService.getACategoryBy(id);

    if (!category) throw new HttpException('Category Not Found', 404);

    return category;
  }
}
