import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
} from '@nestjs/common';

import { ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';

import { Gateway } from './interfaces/gateway.interface';
import { GatewaysService } from './gateway.service';
import { CreateGatewayDTO } from './dto/gateway.dto';
import { CreatePeripheralDeviceDTO } from './dto/peripheral-device.dto';
import { isNumber, isNumberString } from 'class-validator';

@ApiTags('gateway')
@Controller('gateway')
export class GatewaysController {
  constructor(private readonly gatewaysService: GatewaysService) {}

  @Get()
  @ApiQuery({
    name: 'limit',
    description: 'Default value 10',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'skip',
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
  async getAll(
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
    @Query('order') order?: string,
  ): Promise<{ items: Gateway[]; count: number }> {

    if (isNumberString(limit) && isNumberString(skip)) {
      const gateways = await this.gatewaysService.getAll(
        parseInt(limit),
        parseInt(skip),
        order
      );
      const count = await this.gatewaysService.count();

      return {
        items: gateways,
        count: count,
      };
    }

    const gateways = await this.gatewaysService.getAll(10, 0, order);
    const count = await this.gatewaysService.count();

    return {
      items: gateways,
      count: count,
    };
  }

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<Gateway> {
    return this.gatewaysService.getOne(id);
  }

  @Post('/create')
  @ApiBody({ type: CreateGatewayDTO })
  async createGateway(@Body() gateway: CreateGatewayDTO): Promise<Gateway> {
    return this.gatewaysService.insertOne({
      ipAddress: gateway.ipAddress,
      name: gateway.name,
      serialNumber: gateway.serialNumber,
    });
  }

  @Patch('/:id/addDevice')
  @ApiBody({ type: CreatePeripheralDeviceDTO })
  async addDevice(
    @Param('id') id: string,
    @Body() createPeripheralDeviceDTO: CreatePeripheralDeviceDTO,
  ): Promise<{ id: string }> {
    return this.gatewaysService.addPeripheralDevice(id, {
      dateCreated: createPeripheralDeviceDTO.dateCreated,
      status: createPeripheralDeviceDTO.status,
      uid: createPeripheralDeviceDTO.uid,
      vendor: createPeripheralDeviceDTO.vendor,
    });
  }

  @Patch('/:id/removeDevice/:deviceID')
  async removeDevice(
    @Param('id') id: string,
    @Param('deviceID') deviceID: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    return this.gatewaysService.removePeripheralDevice(id, deviceID);
  }
}
