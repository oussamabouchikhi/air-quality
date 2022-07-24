import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AirQualityDocument = AirQuality & Document;

@Schema()
export class Pollution {
  @Prop()
  ts: string;

  @Prop()
  aqius: number;

  @Prop()
  mainus: string;

  @Prop()
  aqicn: number;

  @Prop()
  maincn: string;
}

@Schema()
export class Result {
  @Prop({ type: Pollution, index: true })
  pollution: Pollution;
}

@Schema()
export class AirQuality {
  @Prop({ type: Result, index: true })
  result: Result;

  @Prop()
  datetime: string;
}

export const AirQualitySchema = SchemaFactory.createForClass(AirQuality);
