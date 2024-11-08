import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { AdminsModule } from '../admins';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards';

@Module({
  imports: [
    forwardRef(() => AdminsModule),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
