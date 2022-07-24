import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityService } from './air-quality.service';

describe('AirQualityService', () => {
  let service: AirQualityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirQualityService],
    }).compile();

    service = module.get<AirQualityService>(AirQualityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
