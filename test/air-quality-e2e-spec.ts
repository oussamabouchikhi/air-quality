import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AirQualityModule } from '../src/air-quality/air-quality.module';
import { AirQualityService } from '../src/air-quality/air-quality.service';
import { MongooseModule } from '@nestjs/mongoose';

describe('AirQualityController (e2e)', () => {
  let app: INestApplication;
  const mockAirQuality = {
    result: {
      ts: '2022-07-24T16:00:00.000Z',
      aqius: 41,
      mainus: 'p2',
      aqicn: 31,
      maincn: 'o3',
    },
  };
  const mockAirQualityService = {
    getAllAirQuality: jest.fn().mockResolvedValue(mockAirQuality),
    createCity: jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        id: 123,
        ...dto,
        weather: { humidity: 48 },
      }),
    ),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AirQualityModule, MongooseModule],
      providers: [AirQualityService],
    })
      .overrideProvider(AirQualityService)
      .useValue(mockAirQualityService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/air-quality (GET)', () => {
    return request(app.getHttpServer())
      .get('/air-quality')
      .send({ latitude: '48.856613', longitude: '2.352222' })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(mockAirQuality);
  });

  it('/air-quality/nearest_city (Get)', () => {
    return request(app.getHttpServer())
      .post('/air-quality/nearest_city')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            result: expect.objectContaining({
              ts: '2022-07-24T15:00:00.000Z',
              aqius: 70,
              mainus: 'p2',
              aqicn: 30,
              maincn: 'p2',
            }),
          }),
        );
      });
  });

  it('/air-quality/paris (Get)', () => {
    return request(app.getHttpServer())
      .post('/air-quality/paris')
      .expect('Content-Type', /json/)
      .expect(200);
  });
  it('/air-quality/paris/pollution (Get)', () => {
    return request(app.getHttpServer())
      .post('/air-quality/paris')
      .expect('Content-Type', /json/)
      .expect(200);
  });
});
