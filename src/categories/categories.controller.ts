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
import { AuthenticateAdmin } from 'src/guards/admin/admin-auth.decorator';
import { AdminAuthGuard } from 'src/guards/admin/admin.guard';
import { SkipAuth } from 'src/guards/auth.decorator';

@UseGuards(AdminAuthGuard)
@AuthenticateAdmin()
@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Post('create')
  createCategory(@Body() data: CreateCategoryDto) {
    return this.categoryService.createCategory(data);
  }

  @SkipAuth()
  @Get('all')
  getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Patch('edit/:id')
  updateCategory(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return this.categoryService.updateCatgory(id, data);
  }

  @Delete('delete/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCatgory(id);
  }

  @Get(':id')
  async getACategory(@Param('id') id: string) {
    const category = await this.categoryService.getACategoryBy(id);

    if (!category) throw new HttpException('Category Not Found', 404);

    return category;
  }
}
