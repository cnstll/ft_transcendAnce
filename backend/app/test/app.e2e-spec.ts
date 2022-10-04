import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it('/ (POST)', () => {
  //   return request(app.getHttpServer())
  //     .post('/auth/create')
  //     .send({ name: 'a' })
  //     .expect(201)
  // });
  // it('/ (POST)', () => {
  //   return request(app.getHttpServer())
  //     .post('/auth/create')
  //     .send({ name: 'a' })
  //     .expect(500)
  // });
  // it('/ (POST)', () => {
  //   return request(app.getHttpServer())
  //     .post('/auth/create')
  //     .send({ name: 'b' })
  //     .expect(201)
  // });
  // it('/ (POST)', () => {
  //   return request(app.getHttpServer())
  //     .post('/auth/create')
  //     .send({ name: 'c' })
  //     .expect(201)
  // });
  // it('/ (POST)', () => {
  //   return request(app.getHttpServer())
  //     .post('/auth/create')
  //     .send({ name: 'd' })
  //     .expect(201)
  // });
  it('redirect to 42 login page', async function() {
    const response = await request(app.getHttpServer())
      .get('/auth/signin').redirects(2)
    expect(200);
    expect(response.text).toContain("42");
  });
});
