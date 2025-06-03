import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/Product.dto';
import { AdminAuthGuard } from 'src/guards/admin/admin.guard';
import { AuthenticateAdmin } from 'src/guards/admin/admin-auth.decorator';

@UseGuards(AdminAuthGuard)
@AuthenticateAdmin()
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      const product =
        await this.productsService.createProduct(createProductDto);
      return {
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }
}
