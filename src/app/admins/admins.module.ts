import { Module } from '@nestjs/common';
import { AdminsController } from './controllers';
import { AdminsService } from './services';
import { AdminsRepository } from './repositories';

@Module({
  controllers: [AdminsController],
  providers: [AdminsService, AdminsRepository],
  exports: [AdminsService, AdminsRepository],
})
export class AdminsModule {}
