import { IsIP, ArrayMaxSize, IsNotEmpty } from 'class-validator';
import {
  ApiProperty,
  getSchemaPath,
  ApiExtraModels,
  PickType,
} from '@nestjs/swagger';
import { PeripheralDeviceDTO } from './peripheral-device.dto';

@ApiExtraModels(PeripheralDeviceDTO)
export class GatewayDTO {
  readonly _id?: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique field',
  })
  readonly serialNumber: string;

  @IsIP('4')
  @ApiProperty({
    description: 'Internet protocol version 4',
  })
  readonly ipAddress: string;

  @ArrayMaxSize(10)
  @ApiProperty({
    type: [PeripheralDeviceDTO],
    items: {
      oneOf: [{ $ref: getSchemaPath(PeripheralDeviceDTO) }],
    },
  })
  readonly peripheralDevice: PeripheralDeviceDTO[];
}

export class CreateGatewayDTO extends PickType(GatewayDTO, [
  'name',
  'serialNumber',
  'ipAddress',
] as const) {}
