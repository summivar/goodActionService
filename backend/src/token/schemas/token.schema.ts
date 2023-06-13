import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';

export type TokensDocument = Token & Document;

@Schema()
export class Token {
  @Prop({type: Types.ObjectId, required: true, unique: true})
  user: Types.ObjectId

  @Prop()
  refreshToken: string;
}

export const TokensSchema = SchemaFactory.createForClass(Token);