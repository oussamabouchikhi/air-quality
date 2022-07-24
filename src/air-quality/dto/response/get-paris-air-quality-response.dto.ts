export class GetParisAirQualityResponseDto {
  result: {
    pollution: {
      ts: string;
      aqius: number;
      mainus: string;
      aqicn: number;
      maincn: string;
    };
  };
  datetime: string;
}
