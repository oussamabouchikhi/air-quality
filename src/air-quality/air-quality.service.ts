import { GetCityAirQualityDto } from './dto/request/get-city-air-quality.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { GetCityAirQualityResponseDto } from './dto/response/get-city-air-quality-response.dto';
import { lastValueFrom, map } from 'rxjs';
import { Cron, SchedulerRegistry, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AirQuality, AirQualityDocument } from './schemas/air-quality.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AirQualityService {
  private logger = new Logger('AirQualityService');
  constructor(
    @InjectModel(AirQuality.name)
    private readonly airQualityModel: Model<AirQualityDocument>,
    private readonly httpService: HttpService,
    private schedulerRegistry: SchedulerRegistry,
    private configService: ConfigService,
  ) {}

  async getCityAirQuality(
    getCityAirQualityDto: GetCityAirQualityDto,
  ): Promise<GetCityAirQualityResponseDto> {
    try {
      const { latitude, longitude } = getCityAirQualityDto;
      const key = this.configService.get<string>('IQAIR_KEY');
      const airQuality = await lastValueFrom(
        this.httpService
          .get(
            `http://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${key}`,
          )
          .pipe(map((response) => response.data.data.current.pollution)),
      );

      if (!airQuality) {
        throw new NotFoundException('City not found');
      }

      return { result: airQuality };
    } catch (error) {
      this.logger.error('Error getting city air quality', error);
    }
  }

  startTime = new Date().getTime();
  numberOfMinutes = 10;
  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'myJob',
  })
  async getParisAirQuality() {
    this.logger.verbose(`Getting paris air quality`);
    const result = await this.getCityAirQuality({
      latitude: '48.856613',
      longitude: '2.352222',
    });

    const airQuality = new this.airQualityModel({
      result,
      datetime: new Date().toLocaleString(),
    });
    await airQuality.save();

    this.closeJob();

    return {
      result: airQuality.result,
      datetime: new Date().toLocaleString(),
    };
  }

  closeJob() {
    const job = this.schedulerRegistry.getCronJob('myJob');

    const endTime = this.startTime + 1000 * 60 * Number(this.numberOfMinutes);

    if (job.lastDate().getTime() >= endTime) {
      job.stop();
    }
  }

  async getParisMostPollutedZone() {
    const entries = await this.airQualityModel.find();

    console.log({ entries });

    const highest = entries.reduce(
      (prev, current) =>
        prev['result']['pollution']['aqius'] >
        current['result']['pollution']['aqius']
          ? prev
          : current,
      {},
    );

    return {
      result: highest,
      datetime: new Date().toLocaleString(),
    };
  }

  async getNearestCityAirQuality() {
    try {
      const key = this.configService.get<string>('IQAIR_KEY');
      const airQuality = await lastValueFrom(
        this.httpService
          .get(`http://api.airvisual.com/v2/nearest_city?key=${key}`)
          .pipe(map((response) => response.data.data.current.pollution)),
      );

      return { result: airQuality };
    } catch (error) {
      this.logger.error('Error getting nearest city air quality', error);
    }
  }
}
