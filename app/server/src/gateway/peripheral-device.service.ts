import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { PeripheralDeviceDoc } from './schemas/peripheral-device.schema';
import { PeripheralDevice } from './interfaces/peripheral-device.interface';


@Injectable()
export class PeripheralDeviceService {
  constructor(
    @InjectModel(PeripheralDeviceDoc.name)
    private readonly peripheralDeviceModel: Model<PeripheralDeviceDoc> | any,
  ) {}

  async insertOne(
    createPeripheralDevice: PeripheralDevice,
    gatewayID: Types.ObjectId
  ): Promise<PeripheralDevice> {

    const peripheralDevice = await this.peripheralDeviceModel.create({
      status: createPeripheralDevice.status,
      dateCreated: createPeripheralDevice.dateCreated,
      uid: createPeripheralDevice.uid,
      vendor: createPeripheralDevice.vendor,
      gatewayID: gatewayID
    });

    return {
      _id: peripheralDevice._id,
      status: peripheralDevice.status,
      dateCreated: peripheralDevice.dateCreated.getMilliseconds(),
      uid: peripheralDevice.uid,
      vendor: peripheralDevice.vendor,
    };
  }

  async deleteOne(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      // tslint:disable-next-line: no-invalid-await
      await this.peripheralDeviceModel.delete({ _id: id });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }

  async findByIDs(gatewayID: Types.ObjectId): Promise<PeripheralDevice[]> {
    return await this.peripheralDeviceModel.find({ gatewayID: gatewayID }).lean();
  }

  async countByIDs(gatewayID: Types.ObjectId ): Promise<number> {
    return await this.peripheralDeviceModel.countDocuments({ gatewayID: gatewayID }).lean();
  }
}
