import { Injectable } from '@nestjs/common';
import { AdminsService } from '@src/app/admins/services';
import { SignInDto } from '../dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '@prisma/client';
import { map } from 'rxjs';
import { pick } from 'lodash';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly jwtService: JwtService,
  ) {}

  signIn(signInDto: SignInDto) {
    return this.adminsService.signIn(signInDto).pipe(
      map((admin) => ({
        token: this.jwtService.sign({
          email: admin.email,
          phone: admin.phone,
          id: admin.id,
          name: admin.fullName,
        }),
        admin: pick(admin, ['email', 'id', 'fullName']),
      })),
    );
  }

  profile(admin: Admin) {
    return this.adminsService.detail(admin.id);
  }
}
