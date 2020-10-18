import { PeripheralDevice } from "./peripheral-device.interface";

export interface Gateway {
  _id?: string;
  name: string;
  serialNumber: string;
  ipAddress: string;
  peripheralDevice?: PeripheralDevice[];
}
