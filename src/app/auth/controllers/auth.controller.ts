import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SignInDto } from '../dtos/sign-in.dto';
import { ResponseEntity } from '@src/common/entities/response.entity';
import { AuthGuard } from '../guards';
import { User } from '../decorators';
import { Admin as Auth } from '@prisma/client';
import { catchError, map } from 'rxjs';

@ApiTags('Auth')
@Controller({
  path: 'auth/admin',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Sign in',
  })
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto).pipe(
      map((data) => new ResponseEntity({ data })),
      catchError((error) => {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }),
    );
  }

  @ApiSecurity('JWT')
  @UseGuards(AuthGuard)
  @Get('profile')
  profile(@User() user: Auth) {
    return this.authService.profile(user).pipe(
      map(
        (data) =>
          new ResponseEntity({
            message: 'success',
            data: data,
          }),
        catchError((error) => {
          throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
        }),
      ),
    );
  }
}
