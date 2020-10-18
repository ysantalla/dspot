import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GatewaysController } from './gateway.controller';
import { GatewaysService } from './gateway.service';

import { GatewayDoc, GatewaySchema } from './schemas/gateway.schema';
import {
  PeripheralDeviceDoc,
  PeripheralDeviceSchema,
} from './schemas/peripheral-device.schema';
import { PeripheralDeviceService } from './peripheral-device.service';


@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: GatewayDoc.name,
        collection: GatewayDoc.name,
        useFactory: () => {
          const schema = GatewaySchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-delete'));
          return schema;
        },
      },
      {
        name: PeripheralDeviceDoc.name,
        collection: PeripheralDeviceDoc.name,
        useFactory: () => {
          const schema = PeripheralDeviceSchema;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          schema.plugin(require('mongoose-delete'), { overrideMethods: 'all' });


          return schema;
        },
      },
    ]),
  ],
  controllers: [GatewaysController],
  providers: [GatewaysService, PeripheralDeviceService],
})
export class GatewayModule {}
