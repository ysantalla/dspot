import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { ObjectID } from 'mongodb';

import { GatewayDoc } from './schemas/gateway.schema';
import { Gateway } from './interfaces/gateway.interface';
import { PeripheralDeviceService } from './peripheral-device.service';
import { PeripheralDeviceDoc } from './schemas/peripheral-device.schema';
import { PeripheralDevice } from './interfaces/peripheral-device.interface';

@Injectable()
export class GatewaysService {
  constructor(
    @InjectModel(GatewayDoc.name)
    private readonly gatewayModel: Model<GatewayDoc>,
    private readonly peripheralDeviceService: PeripheralDeviceService,
  ) {}

  async getAll(
    limit = 10,
    skip = 0,
    order = ''
  ): Promise<Gateway[]> {

    const sort: any = {};

    if (order) {
      for (const field of order.split(' ')) {
        sort[field.replace('-', '')] = (field.includes('-')) ? -1 : 1;
      }

      return await this.gatewayModel.aggregate([
        {
          $lookup: {
            from: PeripheralDeviceDoc.name,
            localField: '_id',
            foreignField: 'gatewayID',
            as: 'peripheralDevice',
          },
        },
        {
          $sort: sort,
        },
        {
          $skip: skip * limit,
        },
        {
          $limit: limit,
        }
      ]);
    }

    return await this.gatewayModel.aggregate([
      {
        $lookup: {
          from: PeripheralDeviceDoc.name,
          localField: '_id',
          foreignField: 'gatewayID',
          as: 'peripheralDevice',
        },
      },
      {
        $skip: skip * limit,
      },
      {
        $limit: limit,
      }
    ]);
  }

  async count(): Promise<number> {
    return await this.gatewayModel.countDocuments().lean();
  }

  async getOne(id: string): Promise<Gateway> {
    if (!ObjectID.isValid(id)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Invalid decoding Object ID ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const gateway: Gateway[] = await this.gatewayModel.aggregate([
      { $match: { _id: ObjectID.createFromHexString(id) } },
      {
        $lookup: {
          from: PeripheralDeviceDoc.name,
          localField: '_id',
          foreignField: 'gatewayID',
          as: 'peripheralDevice',
        },
      },
    ]);

    if (gateway.length > 0) {
      return gateway[0];
    }

    throw new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: `Not matches items with Object ID ${id}`,
      },
      HttpStatus.NOT_FOUND,
    );
  }

  /**
   * I would suggest against using something like `new this.gatewayModel()`
   * because it becomes really _really_ hard to mock.
   * Instead, you can use the class method `create` to achieve
   * the same effect.
   */
  async insertOne(createdGateway: Gateway): Promise<Gateway> {
    const gateway = await this.gatewayModel.create({
      name: createdGateway.name,
      ipAddress: createdGateway.ipAddress,
      serialNumber: createdGateway.serialNumber,
    });

    return {
      _id: gateway._id,
      name: gateway.name,
      ipAddress: gateway.ipAddress,
      serialNumber: gateway.serialNumber,
      peripheralDevice: [],
    };
  }

  async addPeripheralDevice(
    id: string,
    createPeripheralDevice: PeripheralDevice,
  ): Promise<{ id: string }> {
    if (!ObjectID.isValid(id)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Invalid decoding Object ID ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const findGateway = await this.gatewayModel.findById(id);

    if (!findGateway) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Gateway not found by ID ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const count = await this.peripheralDeviceService.countByIDs(
      ObjectID.createFromHexString(id),
    );

    if (count == 10) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Gateway must be less or 10 peripheral devices',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const peripheralDevice = await this.peripheralDeviceService.insertOne(
      createPeripheralDevice,
      ObjectID.createFromHexString(id),
    );

    return { id: peripheralDevice._id };
  }

  async removePeripheralDevice(
    id: string,
    peripheralDeviceID: string,
  ): Promise<{ deleted: boolean; message?: string }> {
    if (!ObjectID.isValid(id) || !ObjectID.isValid(peripheralDeviceID)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Invalid decoding Object ID`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const findGateway = await this.gatewayModel.findById(id);

    if (!findGateway) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Gateway not found by ID ${id}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.peripheralDeviceService.deleteOne(peripheralDeviceID);
  }
}
