import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateColorVariantDto } from './dto';

@Injectable()
export class ColorsService {
  constructor(private prisma: PrismaService) {}
}
