import { ApiProperty } from '@nestjs/swagger';

export class GetCityAirQualityDto {
  @ApiProperty({ type: String, description: 'latitude' })
  latitude: string;

  @ApiProperty({ type: String, description: 'longitude' })
  longitude: string;
}
