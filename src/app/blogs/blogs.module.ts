import { Module } from '@nestjs/common';
import { BlogsAdminController, BlogsPublicController } from './controllers';
import { BlogsService } from './services';
import { BlogsRepository } from './repositories';
import { FilesModule } from '../files';

@Module({
  imports: [FilesModule],
  controllers: [BlogsAdminController, BlogsPublicController],
  providers: [BlogsService, BlogsRepository],
})
export class BlogsModule {}
