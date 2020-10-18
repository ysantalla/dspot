import { Test, TestingModule } from '@nestjs/testing';

import { GatewaysController } from './gateway.controller';
import { GatewaysService } from './gateway.service';
import { getModelToken } from '@nestjs/mongoose';
import { GatewayDoc } from './schemas/gateway.schema';
import { Gateway } from './interfaces/gateway.interface';
import { PeripheralDeviceService } from './peripheral-device.service';
import { PeripheralDeviceDoc } from './schemas/peripheral-device.schema';

describe('GatewayController', () => {
  let gatewaysController: GatewaysController;
  let gatewaysService: GatewaysService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GatewaysController],
      providers: [
        GatewaysService,
        PeripheralDeviceService,
        {
          provide: getModelToken(GatewayDoc.name),
          useValue: GatewayDoc,
        },
        {
          provide: getModelToken(PeripheralDeviceDoc.name),
          useValue: PeripheralDeviceDoc,
        },
      ],
    }).compile();

    gatewaysService = app.get<GatewaysService>(GatewaysService);
    gatewaysController = app.get<GatewaysController>(GatewaysController);
  });

  describe('createGateway', () => {
    it('should insert valid gateway', async () => {
      const result: Gateway = {
        ipAddress: '1.2.3.4',
        name: 'Gateway-1',
        serialNumber: 'M123456',
      };

      jest
        .spyOn(gatewaysService, 'insertOne')
        .mockImplementation(async () => result);

      expect(await gatewaysController.createGateway({
        ipAddress: '1.2.3.4',
        name: 'Gateway-1',
        serialNumber: 'M123456'
      })).toBe(result);
    });

    describe('get Gateway', () => {
      it('get all gateway', async () => {

        const result: Gateway[] = [];  
        const count = 0;      
  
        jest
          .spyOn(gatewaysService, 'getAll')
          .mockImplementation(async () => result);
        jest
          .spyOn(gatewaysService, 'count')
          .mockImplementation(async () => count);
  
        expect(await gatewaysController.getAll()).toStrictEqual({"count": 0, "items": []});
      });
    });

  });
});
