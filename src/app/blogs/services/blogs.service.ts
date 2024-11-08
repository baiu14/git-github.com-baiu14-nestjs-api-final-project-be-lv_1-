import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateBlogsDto, UpdateBlogsDto } from '../dtos';
import { from, Observable } from 'rxjs';
import { kebabCase } from 'lodash';
import { FilesService } from '@src/app/files/services';
import { Prisma } from '@prisma/client';
import _ from 'lodash';

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogRepository: BlogsRepository,
    private readonly fileService: FilesService,
  ) {}

  public paginate(paginateDto: PaginationQueryDto): Observable<any> {
    return from(this.blogRepository.paginate(paginateDto));
  }

  public detail(id: string): Observable<any> {
    return from(this.blogRepository.firstOrThrow({ id }));
  }

  public destroy(id: string): Observable<any> {
    return from(this.blogRepository.delete({ id }));
  }

  public async create(
    createBlogsDto: CreateBlogsDto & Partial<{ adminId: string }>,
  ) {
    const slug = createBlogsDto.slug
      ? kebabCase(createBlogsDto.slug)
      : kebabCase(createBlogsDto.title);
    const payload: Prisma.BlogUncheckedCreateInput = {
      content: createBlogsDto.content,
      title: createBlogsDto.title,
      slug: slug,
      adminId: createBlogsDto?.adminId ?? '',
      createdAt: new Date(),
    };
    if (createBlogsDto.image) {
      const cover = await this.fileService.create({
        name: createBlogsDto.title,
        file: Buffer.from(createBlogsDto.image.split(',')[1], 'base64'),
        mimeType: 'image/png',
        public: true,
      });
      const file = _.map(cover, function square(n) {
        return n;
      });

      Object.assign(payload, { coverFile: file ?? '' });
    }
    const res = await this.blogRepository.create(payload);
    console.log('dto : ', res);
    return res;
  }

  public update(id: string, updateBlogsDto: UpdateBlogsDto): Observable<any> {
    return from(this.blogRepository.update({ id }, updateBlogsDto));
  }
}
