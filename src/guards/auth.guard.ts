import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserInterceptorType } from 'types/user';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (roles?.length) {
      const request = context.switchToHttp().getRequest();
      const token = request?.headers?.authorization?.split(' ')[1];
      try {
        jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userPayload: UserInterceptorType = jwt.decode(
          token,
        ) as UserInterceptorType;
        const user = await this.prismaService.user.findUnique({
          where: {
            id: userPayload.id,
          },
        });
        if (!user || !roles.includes(user.type)) {
          return false;
        }
        return true;
      } catch (err) {
        return false;
      }
    }
    return true;
  }
}
