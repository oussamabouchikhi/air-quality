import { Module } from '@nestjs/common';
import { AirQualityService } from './air-quality.service';
import { AirQualityController } from './air-quality.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SchedulerRegistry } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { AirQuality, AirQualitySchema } from './schemas/air-quality.schema';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    SchedulerRegistry,
    MongooseModule.forFeature([
      { name: AirQuality.name, schema: AirQualitySchema },
    ]),
  ],
  controllers: [AirQualityController],
  providers: [AirQualityService, ConfigService],
})
export class AirQualityModule {}
