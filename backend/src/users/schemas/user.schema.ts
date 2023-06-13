import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {GoodAction} from '../../good-action/good-action.model';

export type UsersDocument = User & Document;

@Schema()
export class User {
  @Prop({required: true, unique: true})
  email: string;

  @Prop({required: true})
  username: string;

  @Prop({required:true, unique: true})
  uniqueId: string;

  @Prop({required: true})
  password: string;

  @Prop([String])
  friends: string[];

  @Prop([GoodAction])
  goodActions: GoodAction[];
}

export const UsersSchema = SchemaFactory.createForClass(User);