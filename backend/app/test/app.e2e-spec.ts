import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { response } from 'express';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let cookieA: string;
  let cookieB: string;
  let cookieC: string;
  let cookieD: string;

  it('/ (create test users)', async () => {
    return request(app.getHttpServer())
      .post('/auth/create-user-dev')
      .send({
        nickName: 'a',
        passwordHash: 'b'
      })
      .expect(201)
      .then((response) => {
        cookieA = response.text;
      })
  });


  it('/ (create test users)', async () => {
    return request(app.getHttpServer())
      .post('/auth/create-user-dev')
      .send({
        nickName: 'b',
        passwordHash: 'd'
      })
      .expect(201)
      .then((response) => {
        cookieB = response.text;
      })
  });

  it('/ (create test users)', () => {
    return request(app.getHttpServer())
      .post('/auth/create-user-dev')
      .send({
        nickName: 'c',
        passwordHash: 'd'
      })
      .expect(201)
      .expect(201)
      .then((response) => {
        cookieC = response.text;
      })
  });

  it('/ (create test users)', () => {
    return request(app.getHttpServer())
      .post('/auth/create-user-dev')
      .send({
        nickName: 'd',
        passwordHash: 'd'
      })
      .expect(201)
      .then((response) => {
        cookieD = response.text;
      })
  });

  it('/ (user a requests user b as friend)', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieA;

    return request(app.getHttpServer())
      .post('/user/request-friend')
      .set('Authorization', bearer)
      .send({
        target: 'b'
      })
      .expect(201)
  });

  it('/ (user c requests user d as friend)', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieC;
    return request(app.getHttpServer())
      .post('/user/request-friend')
      .set('Authorization', bearer)
      .send({
        target: 'd'
      })
      .expect(201)
  });

  it('/ (user b accepts a as friend)', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieB;
    return request(app.getHttpServer())
      .put('/user/update-friendship')
      .set('Authorization', bearer)
      .send({
        target: 'a',
        friends: true
      })
      .expect(200)
  });

  it('/ (user b accepts friend request that does not exist)', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieB;
    return request(app.getHttpServer())
      .put('/user/update-friendship')
      .set('Authorization', bearer)
      .send({
        target: 'd',
        friends: true
      })
      .expect(500)
  });

  it('/ (user b accepts a as friend again)', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieB;
    return request(app.getHttpServer())
      .put('/user/update-friendship')
      .set('Authorization', bearer)
      .send({
        target: 'a',
        friends: true
      })
      .expect(200)
  });

  it('/ (user a unfriends user b)', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieA;
    return request(app.getHttpServer())
      .put('/user/update-friendship')
      .set('Authorization', bearer)
      .send({
        target: 'b',
        friends: false
      })
      .expect(200)
  });

  it('/ (user b accepts friend request that does not exist)', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieB;
    return request(app.getHttpServer())
      .put('/user/update-friendship')
      .set('Authorization', bearer)
      .send({
        target: 'a',
        friends: true
      })
      .expect(500)
  });

  it('/ (delete test users)', () => {
    return request(app.getHttpServer())
      .delete('/user/delete')
      .send({
        nickName: 'a',
      })
      .expect(204)
  });

  it('/ (delete test users)', () => {
    return request(app.getHttpServer())
      .delete('/user/delete')
      .send({
        nickName: 'b',
      })
      .expect(204)
  });

  it('/ (delete test users)', () => {
    return request(app.getHttpServer())
      .delete('/user/delete')
      .send({
        nickName: 'c',
      })
      .expect(204)
  });

  it('/ (delete test users)', () => {
    return request(app.getHttpServer())
      .delete('/user/delete')
      .send({
        nickName: 'd',
      })
      .expect(204)
  });


});
