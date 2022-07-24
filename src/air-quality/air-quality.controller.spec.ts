import { Test, TestingModule } from '@nestjs/testing';
import { AirQualityController } from './air-quality.controller';
import { AirQualityService } from './air-quality.service';

describe('AirQualityController', () => {
  let controller: AirQualityController;
  const mockAirQualities = [
    {
      result: {
        ts: '2022-07-24T15:00:00.000Z',
        aqius: 70,
        mainus: 'p2',
        aqicn: 30,
        maincn: 'p2',
      },
    },
    {
      result: {
        ts: '2022-07-24T15:00:00.000Z',
        aqius: 55,
        mainus: 'p2',
        aqicn: 29,
        maincn: 'p2',
      },
    },
  ];

  const mockMostPolluted = [
    {
      result: {
        ts: '2022-07-24T15:00:00.000Z',
        aqius: 70,
        mainus: 'p2',
        aqicn: 30,
        maincn: 'p2',
      },
      datetime: '24/07/2022, 11:13:02',
    },
  ];

  const mockAirQualityService = {
    getCityAirQuality: jest.fn((dto) => mockAirQualities[0]),
    getParisAirQuality: jest.fn(() => mockAirQualities[0]),
    getParisMostPollutedZone: jest.fn(() => mockMostPolluted),
    getNearestCityAirQuality: jest.fn(() => mockAirQualities[1]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirQualityController],
      providers: [AirQualityService],
    })
      .overrideProvider(AirQualityService)
      .useValue(mockAirQualityService)
      .compile();

    controller = module.get<AirQualityController>(AirQualityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get Paris air quality', () => {
    const dto = {
      latitude: '48.856613',
      longitude: '2.352222',
    };
    expect(controller.getCityAirQuality(dto)).toEqual(mockAirQualities[0]);

    expect(mockAirQualityService.getCityAirQuality).toHaveBeenCalledWith(dto);
  });

  it('should get Paris air quality', () => {
    expect(controller.getParisAirQuality()).toEqual(mockAirQualities[0]);

    expect(mockAirQualityService.getParisAirQuality).toHaveBeenCalled();
  });

  it('should get most polluted Paris entry', () => {
    expect(controller.getParisMostPollutedZone()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ...mockAirQualities[0] }),
      ]),
    );

    expect(mockAirQualityService.getParisMostPollutedZone).toHaveBeenCalled();
  });

  it('should get nearest city air quality', () => {
    expect(controller.getNearestCityAirQuality()).toEqual(mockAirQualities[1]);

    expect(mockAirQualityService.getNearestCityAirQuality).toHaveBeenCalled();
  });
});
