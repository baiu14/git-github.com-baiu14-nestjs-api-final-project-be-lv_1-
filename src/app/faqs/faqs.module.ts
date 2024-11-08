import { Module } from '@nestjs/common';
import { FaqsAdminController, FaqsPublicController } from './controllers';
import { FaqsService } from './services';
import { FaqsRepository } from './repositories';

@Module({
  controllers: [FaqsAdminController, FaqsPublicController],
  providers: [FaqsService, FaqsRepository],
})
export class FaqsModule {}
