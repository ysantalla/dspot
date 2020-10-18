import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class GatewayDoc extends Document {
  @Prop({
    unique: true,
  })
  serialNumber: string;

  @Prop()
  name: string;

  @Prop()
  ipAddress: string;

}

export const GatewaySchema = SchemaFactory.createForClass(GatewayDoc);
