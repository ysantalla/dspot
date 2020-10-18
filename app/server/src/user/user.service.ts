import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDoc } from './entities/user.entity';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(UserDoc.name)
    private readonly userModel: Model<UserDoc>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userCreate = await this.userModel.create(createUserDto);

    const user: User = {
      age: userCreate.age,
      email: userCreate.email,
      firstname: userCreate.firstname,
      lastname: userCreate.lastname,
      id: userCreate.id
    };

    return user;
  }

  async findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {

    // const user = await this.



    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
