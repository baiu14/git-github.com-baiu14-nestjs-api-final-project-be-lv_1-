import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from 'src/app/blogs/services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { CreateBlogsDto, UpdateBlogsDto } from 'src/app/blogs/dtos';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '@src/app/auth/decorators';
import { Admin as Auth } from '@prisma/client';
import { AuthGuard } from '@src/app/auth';

@ApiTags('Blogs')
@Controller({
  path: '/admin/blog',
  version: '1',
})
export class BlogsAdminController {
  constructor(private readonly blogService: BlogsService) {}

  @UseGuards(AuthGuard)
  @ApiSecurity('JWT')
  @Post()
  public create(
    @Body() createBlogsDto: CreateBlogsDto,
    @User() user: Auth,
  ): Observable<ResponseEntity> {
    Object.assign(createBlogsDto, { adminId: user.id });
    return from(this.blogService.create(createBlogsDto)).pipe(
      map((data) => new ResponseEntity({ data, message: 'success' })),
      catchError((error) => {
        console.log('error', error);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @ApiSecurity('JWT')
  @Get()
  public index(
    @Query() paginateDto: PaginationQueryDto,
  ): Observable<ResponseEntity> {
    return from(this.blogService.paginate(paginateDto)).pipe(
      map((data) => new ResponseEntity({ data, message: 'success' })),
      catchError((error) => {
        console.log('error', error);
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @ApiSecurity('JWT')
  @Get(':id')
  public detail(@Param('id') id: string): Observable<ResponseEntity> {
    console.log('id', id);
    return this.blogService.detail(id).pipe(
      map((data) => new ResponseEntity({ data, message: 'success' })),
      catchError((error) => {
        console.log('error', error);
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @ApiSecurity('JWT')
  @Delete(':id')
  public destroy(@Param('id') id: string): Observable<ResponseEntity> {
    return from(this.blogService.destroy(id)).pipe(
      map((data) => new ResponseEntity({ data, message: 'success' })),
      catchError((error) => {
        console.log('error', error);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }),
    );
  }

  @UseGuards(AuthGuard)
  @ApiSecurity('JWT')
  @Put(':id')
  public update(
    @Param('id') id: string,
    @Body() updateBlogsDto: UpdateBlogsDto,
  ): Observable<ResponseEntity> {
    return from(this.blogService.update(id, updateBlogsDto)).pipe(
      map((data) => new ResponseEntity({ data, message: 'success' })),
      catchError((error) => {
        console.log('error', error);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }),
    );
  }
}
