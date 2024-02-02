import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { userRegisterInterface, userSighInInterface } from 'types/user';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}
  async signUp({ email, name, password, phone }: userRegisterInterface) {
    const userSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, userSalt);
    const userExists = await this.findUserByEmail(email);
    if (userExists) {
      throw new ConflictException();
    }
    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        phone,
        type: UserType.BUYER,
        userSalt,
      },
    });
    return this.generateJWT(user.name, user.id);
  }
  async signIn({ email, password }: userSighInInterface) {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new HttpException('Invalid password or email', 400);
    }
    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    if (!isValidPassword) {
      throw new HttpException('Invalid password or email', 400);
    }
    return this.generateJWT(user.name, user.id);
  }
  async getMe(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }
  private async findUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }
  private async generateJWT(name: string, id: number) {
    return {
      token: jwt.sign({ name, id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 360000,
      }),
    };
  }
}