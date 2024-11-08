import { Injectable } from '@nestjs/common';
import { FilesRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateFilesDto, UpdateFilesDto } from '../dtos';
import { catchError, from, map, mergeMap } from 'rxjs';
import { StorageService } from '@src/platform/storage/service/storage.service';

@Injectable()
export class FilesService {
  constructor(
    private readonly fileRepository: FilesRepository,
    private readonly storageService: StorageService,
  ) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return from(this.fileRepository.paginate(paginateDto));
  }

  public detail(id: string) {
    return from(this.fileRepository.firstOrThrow({ id }));
  }

  public destroy(id: string) {
    return from(this.fileRepository.delete({ id }));
  }

  public async create(createFilesDto: CreateFilesDto) {
    const upload = this.storageService
      .upload({
        file: createFilesDto.file,
        fileName: createFilesDto.name,
        mimeType: createFilesDto.mimeType,
      })
      .pipe(
        catchError(() => {
          console.log('Failed to upload file');
          throw new Error('Failed to upload file');
        }),
        map(() => ({
          size: upload.file.length,
          name: upload.name,
          url: upload.url,
          public: upload.public,
          mime: upload.mimeType,
        })),
        mergeMap((data) => this.fileRepository.create(data)),
      );
    return upload;
  }

  public update(id: string, updateFilesDto: UpdateFilesDto) {
    return from(this.fileRepository.update({ id }, updateFilesDto));
  }
}
