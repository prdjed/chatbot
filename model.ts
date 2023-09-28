import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ModelDocument = HydratedDocument<Model>;

@Schema()
export class Model {
  @Prop()
  question: string;

  @Prop()
  answer: string;
}

export const ModelSchema = SchemaFactory.createForClass(Model)