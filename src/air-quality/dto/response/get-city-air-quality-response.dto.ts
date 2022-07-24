export class GetCityAirQualityResponseDto {
  result: {
    pollution: {
      ts: string;
      aqius: number;
      mainus: string;
      aqicn: number;
      maincn: string;
    };
  };
}
