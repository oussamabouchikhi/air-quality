import { GetCityAirQualityResponseDto } from './dto/response/get-city-air-quality-response.dto';
import { GetCityAirQualityDto } from './dto/request/get-city-air-quality.dto';
import { Body, Controller, Get } from '@nestjs/common';
import { ApiBody, ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { AirQualityService } from './air-quality.service';
import { GetParisAirQualityResponseDto } from './dto/response/get-paris-air-quality-response.dto';

@Controller('air-quality')
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  /**
   * Get the current air quality of a given city by lat long
   * @param getCityAirQualityDto { latitude: string, logitude: string }
   * @returns Given city current air quality
   */
  @Get()
  @ApiOkResponse({ description: 'Get city air quality' })
  @ApiBody({ type: GetCityAirQualityDto })
  @ApiNotFoundResponse({ description: 'City not found' })
  getCityAirQuality(
    @Body() getCityAirQualityDto: GetCityAirQualityDto,
  ): Promise<GetCityAirQualityResponseDto> {
    return this.airQualityService.getCityAirQuality(getCityAirQualityDto);
  }

  /**
   * Get the current air quality of Paris
   * @returns the current air quality of Paris
   */
  @Get('paris')
  @ApiOkResponse({ description: 'Get Paris city air quality' })
  getParisAirQuality(): Promise<GetParisAirQualityResponseDto> {
    return this.airQualityService.getParisAirQuality();
  }

  /**
   * Get the most polluted zone based on previous records of Paris
   * @returns the most polluted record for Paris
   */
  @Get('paris/pollution')
  @ApiOkResponse({ description: 'Get Paris city zone most polluted' })
  getParisMostPollutedZone(): any {
    return this.airQualityService.getParisMostPollutedZone();
  }

  /**
   * Get the current air quality of the nearest city by geolocation
   * @returns current air quality of the nearest city
   */
  @Get('nearest_city')
  @ApiOkResponse({ description: 'Get nearest city air quality' })
  getNearestCityAirQuality() {
    return this.airQualityService.getNearestCityAirQuality();
  }
}
