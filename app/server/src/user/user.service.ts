import {
  Injectable,
  NotFoundException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';

import { Model, isValidObjectId } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

import { UserDoc } from './entities/user.entity';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserDoc.name)
    private readonly userModel: Model<UserDoc>,
  ) {}

  findAll(paginationQuery?: PaginationQueryDto, order = ''): Promise<User[]> {
    const sort: any = {};

    if (order) {
      for (const field of order.split(' ')) {
        sort[field.replace('-', '')] = field.includes('-') ? -1 : 1;
      }
    }

    if (paginationQuery) {
      const { limit, offset } = paginationQuery;

      return this.userModel
        .find()
        .sort(sort)
        .skip(offset * limit)
        .limit(limit)
        .exec();
    }

    return this.userModel
      .find()
      .sort(sort)
      .exec();
  }

  count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  async findOne(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Invalid decoding Object ID ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Invalid decoding Object ID ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingUser = await this.userModel
      .findOneAndUpdate(
        { _id: id },
        { $set: updateUserDto },
        { new: true, useFindAndModify: false },
      )
      .lean(true);

    if (!existingUser) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `User #${id} not found`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return existingUser;
  }

  async remove(id: string): Promise<({
    n: number,
    ok: number,
    deletedCount: number
  })> {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Invalid decoding Object ID ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.userModel.deleteOne({ _id: id }).lean(true);
  }
}
