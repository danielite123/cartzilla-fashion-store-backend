import { Module, NestModule } from '@nestjs/common';
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
import { configurations } from './config/configurations';
import { ConfigModule } from '@nestjs/config';
import { GuardsModule } from './guards/guards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || configurations().auth.jwt,
      signOptions: { expiresIn: '3d' },
    }),
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
    GuardsModule,
  ],
})
export class AppModule implements NestModule {
  configure() {}
}
