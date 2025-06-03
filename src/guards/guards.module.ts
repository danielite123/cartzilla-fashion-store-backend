import { Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class GuardsModule {}
