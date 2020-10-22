import {
  Injectable,
  NotFoundException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UserDoc } from './entities/user.entity';
import { Model, isValidObjectId } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserDoc.name)
    private readonly userModel: Model<UserDoc>,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.userModel
      .find()
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async findOne(id: string) {
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

  create(createUserDto: CreateUserDto) {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
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
      .findOneAndUpdate({ _id: id }, { $set: updateUserDto }, { new: true })
      .exec();

    if (!existingUser) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return existingUser;
  }

  async remove(id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Invalid decoding Object ID ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.findOne(id);
    return user.remove();
  }
}
