import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class PeripheralDeviceDTO {
  @IsNumber()
  @ApiProperty()
  uid: number;

  @IsNotEmpty()
  @ApiProperty()
  vendor: string;

  @IsEnum(['ONLINE', 'OFFLINE'])
  @ApiProperty({ enum: ['ONLINE', 'OFFLINE'] })
  status: string;

  @ApiProperty({
    description: 'Date in unix format',
  })
  @IsNumber()
  dateCreated: number;
}

export class CreatePeripheralDeviceDTO extends PartialType(
  PeripheralDeviceDTO,
) {}
