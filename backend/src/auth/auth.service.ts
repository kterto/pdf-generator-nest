import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dtos/create-user.dto";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<Partial<User> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const { password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ access_token: string; user: Partial<User> }> {
    const payload = { email: email, password: password };
    return {
      access_token: this.jwtService.sign(payload),
      user: await this.usersService.findByEmail(email),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.login({ email: user.email, password: createUserDto.password });
  }

  async userData(email: string): Promise<User> {
    return await this.usersService.findByEmail(email);
  }
}
