import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async findByEmail(email: string): Promise<User> | undefined {
    return await this.usersRepository
      .findOne({ where: { email } })
      .catch(() => {
        throw new NotFoundException(`User with email ${email} not found`);
      });
  }

  async create(user: CreateUserDto): Promise<User> {
    const existingEmail = await this.findByEmail(user.email);
    if (user.email && !!existingEmail === true)
      throw new HttpException(
        {
          statusCode: 400,
          error: "Bad Request",
          message: "Email already exists",
        },
        HttpStatus.BAD_REQUEST
      );

    const { password, ...data } = user;
    const password_hash = await bcrypt.hash(password, 10);

    return await this.usersRepository.save({
      ...data,
      password_hash,
    });
  }
}
