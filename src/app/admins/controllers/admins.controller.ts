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
import { AdminsService } from '../services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { CreateUsersDto, UpdateUsersDto } from '../dtos';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@app/auth';

@ApiTags('Admins')
@ApiSecurity('JWT')
@UseGuards(AuthGuard)
@Controller({
  path: 'admin',
  version: '1',
})
export class AdminsController {
  constructor(private readonly adminService: AdminsService) {}

  @Post('create')
  public async create(@Body() createUsersDto: CreateUsersDto) {
    try {
      const data = await this.adminService.create(createUsersDto);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('paginate')
  public async index(@Query() paginateDto: PaginationQueryDto) {
    try {
      const data = await this.adminService.paginate(paginateDto);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('detail/:id')
  public async detail(@Param('id') id: string) {
    try {
      const data = await this.adminService.detail(id);

      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete('remove/:id')
  public async destroy(@Param('id') id: string) {
    try {
      const data = await this.adminService.destroy(id);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('update/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateUsersDto: UpdateUsersDto,
  ) {
    try {
      const data = await this.adminService.update(id, updateUsersDto);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
