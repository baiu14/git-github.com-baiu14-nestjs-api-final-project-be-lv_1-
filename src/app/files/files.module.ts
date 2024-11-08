import { Module } from '@nestjs/common';
import { FilesService } from './services';
import { FilesRepository } from './repositories';

@Module({
  controllers: [],
  providers: [FilesService, FilesRepository],
  exports: [FilesService],
})
export class FilesModule {}
