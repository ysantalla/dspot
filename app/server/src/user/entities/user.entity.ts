
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserDoc extends Document {
  @Prop()
  firstname: string;
  @Prop()
  lastname: string;
  @Prop()
  age: number;
  @Prop()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDoc);
