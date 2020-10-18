import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/gateway (GET)', () => {
    return request(app.getHttpServer())
      .get('/gateway')
      .expect(200)
  });

  it('create (POST)', () => {
    return request(app.getHttpServer())
      .post('/gateway/create')
      .send({
        name: "Gat 1",
        serialNumber: 'S-12345',
        ipAddress: '192.2.3.4',
      })
      .expect(201)
  });
});
