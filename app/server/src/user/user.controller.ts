import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiQuery } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiQuery({
    name: 'limit',
    description: 'Default value 10',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Default value 0',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'order',
    description: `'name -email', means: order property name ASC and email DESC`,
    type: String,
    required: false,
  })
  async findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('order') order?: string,
  ) {

    const paginationQueryDto: PaginationQueryDto = {
      limit: +limit,
      offset: +offset,
    };

    const items = await this.userService.findAll(paginationQueryDto, order);
    const total = await this.userService.count();

    return {items, total};
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
