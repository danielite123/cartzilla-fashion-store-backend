import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
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

  @Patch('edit/:id')
  @UseGuards(AuthGuard, AdminGuard)
  updateCategory(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return this.categoryService.updateCatgory(id, data);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, AdminGuard)
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCatgory(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard, AdminGuard)
  async getACategory(@Param('id') id: string) {
    const category = await this.categoryService.getACategoryBy(id);

    if (!category) throw new HttpException('Category Not Found', 404);

    return category;
  }
}
