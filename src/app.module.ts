import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CartsModule } from './carts/carts.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ProductsModule,
    UsersModule,
    PrismaModule,
    CartsModule,
    CategoriesModule,
    ReviewsModule,
  ],
})
export class AppModule {}
