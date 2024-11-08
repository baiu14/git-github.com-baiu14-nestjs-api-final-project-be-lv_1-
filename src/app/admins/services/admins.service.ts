import { Injectable } from '@nestjs/common';
import { AdminsRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateUsersDto, UpdateUsersDto } from '../dtos';
import { hashSync, verifySync } from '@node-rs/bcrypt';
import { SignInDto } from 'src/app/auth/dtos';
import { catchError, from, map, switchMap } from 'rxjs';

@Injectable()
export class AdminsService {
  constructor(private readonly adminRepository: AdminsRepository) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.adminRepository.paginate(paginateDto);
  }

  public detail(id: string) {
    return from(
      this.adminRepository.firstOrThrow(
        {
          id,
        },
        {
          id: true,
          email: true,
          fullName: true,
        },
      ),
    ).pipe(
      catchError((error) => {
        throw new Error(error);
      }),
    );
  }

  public async destroy(id: string) {
    try {
      return this.adminRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createUsersDto: CreateUsersDto) {
    try {
      return this.adminRepository.create(createUsersDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async update(id: string, updateUsersDto: UpdateUsersDto) {
    try {
      return this.adminRepository.update({ id }, updateUsersDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public signUp(signUpDto: CreateUsersDto) {
    return from(
      this.adminRepository.any({
        where: {
          email: signUpDto.email,
        },
      }),
    ).pipe(
      map((exist) => {
        if (exist) throw new Error('error.user_already_exist');
        return hashSync(signUpDto.password);
      }),
      switchMap((password) => {
        return this.adminRepository.create({
          ...signUpDto,
          password,
        });
      }),
    );
  }

  public signIn(signInDto: SignInDto) {
    return from(
      this.adminRepository.firstOrThrow({
        email: signInDto.email,
      }),
    ).pipe(
      map((user) => {
        if (user.email != signInDto.email) throw new Error('error.not_found');

        if (!verifySync(signInDto.password, user.password))
          throw new Error('error.password_not_match');

        return user;
      }),
      catchError((error) => {
        throw new Error(error.message);
      }),
    );
  }
}
