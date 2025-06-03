import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/Product.dto';
import { AdminAuthGuard } from 'src/guards/admin/admin.guard';
import { AuthenticateAdmin } from 'src/guards/admin/admin-auth.decorator';
import { SkipAuth } from 'src/guards/auth.decorator';

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

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Get('all')
  async getAllProducts() {
    try {
      const products = await this.productsService.getAllProducts();
      return {
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      console.error('Error retrieving products:', error);
      throw error;
    }
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    try {
      const product = await this.productsService.getProduct(id);
      if (!product) {
        return {
          message: 'Product not found',
        };
      }
      return {
        message: 'Product retrieved successfully',
        data: product,
      };
    } catch (error) {
      console.error('Error retrieving product:', error);
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('category/:categoryId')
  async getProductsByCategory(@Param('categoryId') categoryId: string) {
    try {
      const products =
        await this.productsService.getProductsByCategory(categoryId);
      return {
        message: 'Products retrieved successfully',
        data: products,
      };
    } catch (error) {
      console.error('Error retrieving products by category:', error);
      throw error;
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const updatedProduct = await this.productsService.updateProduct(
        id,
        updateProductDto,
      );
      return {
        message: 'Product updated successfully',
        data: updatedProduct,
      };
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id') id: string) {
    try {
      await this.productsService.deleteProduct(id);
      return {
        message: 'Product deleted successfully',
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}
