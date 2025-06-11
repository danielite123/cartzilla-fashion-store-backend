import { IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderDto {
  @IsEnum(OrderStatus, {
    message: 'Status must be one of: IN_PROGRESS, DELIVERED, CANCELLED',
  })
  status?: OrderStatus;
}
