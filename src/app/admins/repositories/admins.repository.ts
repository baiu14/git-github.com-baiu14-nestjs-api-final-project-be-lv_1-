import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

type Filter = {
  where?: Prisma.AdminWhereInput;
  orderBy?: Prisma.AdminOrderByWithRelationInput;
  cursor?: Prisma.AdminWhereUniqueInput;
  take?: number;
  skip?: number;
};

@Injectable()
export class AdminsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.admin.findMany({
        skip: (+page - 1) * +limit,
        take: +limit,
        ...filter,
      }),
      this.prismaService.admin.count(),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.AdminCreateInput) {
    return this.prismaService.admin.create({ data });
  }

  public async update(
    where: Prisma.AdminWhereUniqueInput,
    data: Prisma.AdminUpdateInput,
  ) {
    return this.prismaService.admin.update({ where, data });
  }

  public async delete(where: Prisma.AdminWhereUniqueInput) {
    return this.prismaService.admin.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Partial<Prisma.AdminWhereUniqueInput>,
    select?: Prisma.AdminSelect,
  ) {
    return this.prismaService.admin.findFirst({ where, select });
  }

  public async firstOrThrow(
    where: Partial<Prisma.AdminWhereUniqueInput>,
    select?: Prisma.AdminSelect,
  ) {
    console.log('where : ', where);
    const data = await this.prismaService.admin.findFirst({ where, select });
    if (!data) throw new Error('error.not_found');
    return data;
  }

  public async find(filter: Omit<Filter, 'include'>) {
    return this.prismaService.admin.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.admin.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.admin.count(filter)) > 0;
  }
}
