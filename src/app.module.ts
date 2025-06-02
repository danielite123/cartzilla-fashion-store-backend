import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CartsModule } from './carts/carts.module';
import { CategoriesModule } from './categories/categories.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UploadModule } from './upload/upload.module';
import { CloudinaryModule } from './upload/cloudinary/cloudinary.module';
import { ColorsModule } from './colors/colors.module';

@Module({
  imports: [
    JwtModule.register({ global: true, secret: process.env.JWT_SECRET }),
    ProductsModule,
    UsersModule,
    PrismaModule,
    CartsModule,
    CategoriesModule,
    ReviewsModule,
    AuthModule,
    UploadModule,
    CloudinaryModule,
    ColorsModule,
  ],
})
export class AppModule {}
