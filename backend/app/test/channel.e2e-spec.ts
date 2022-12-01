import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Channel controller (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);

  });

  afterAll(
    async () => {
      const deleteChannel = prisma.channel.deleteMany()

      await prisma.$transaction([
        deleteChannel,
      ])

      await prisma.$disconnect()
      app.close();
    });

  let cookieTestA: string;
  let cookieTestB: string;

  /******************************************************************************/
  /* USERS TESTS */
  /******************************************************************************/

  describe('Create users for tests', () => {
    it('/ (create test users)', async () => {
      return request(app.getHttpServer())
        .post('/auth/create-user-dev')
        .send({
          nickname: 'testchannel1',
          immutableId: 'testchannel1',
        })
        .expect(201)
        .then((response) => {
          cookieTestA = response.text;
        })
    });

    it('/ (create test users)', async () => {
      return request(app.getHttpServer())
        .post('/auth/create-user-dev')
        .send({
          nickname: 'testchannel2',
          immutableId: 'testchannel2',
        })
        .expect(201)
        .then((response) => {
          cookieTestB = response.text;
        })
    });
  })

  /******************************************************************************/
  /* CHANNELS TESTS */
  /******************************************************************************/

  let publicChan: string;
  let privateChan: string;
  let protectedChan: string;
  let directMessage: string;

  /***********************/
  /* CREATE */
  /***********************/
  describe('Creation of channels', () => {
    it('/ user C creates a default public channel with a name', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .post('/channels/create')
        .set('Authorization', bearer)
        .send({
          "name": "Channel test 1",
        })
        .expect(201)
        .then((response) => {
          publicChan = response.text.substring(7, 32);
          expect(response.text).toContain('"name":"Channel test 1"');
          expect(response.text).toContain('"type":"PUBLIC"');
        })
    });

    it('/ user C creates a public channel with a name', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .post('/channels/create')
        .set('Authorization', bearer)
        .send({
          "name": "Channel test 2",
          "type": "PUBLIC"
        })
        .expect(201)
        .then((response) => {
          expect(response.text).toContain('"name":"Channel test 2"');
          expect(response.text).toContain('"type":"PUBLIC"');
        })
    });

    it('/ user C creates a private channel with a name', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .post('/channels/create')
        .set('Authorization', bearer)
        .send({
          "name": "Channel test 3",
          "type": "PRIVATE",
        })
        .expect(201)
        .then((response) => {
          privateChan = response.text.substring(7, 32);
          expect(response.text).toContain('"name":"Channel test 3"');
          expect(response.text).toContain('"type":"PRIVATE"');
        })
    });

    it('/ user D creates a protected channel with a name + password', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestB;
      return request(app.getHttpServer())
        .post('/channels/create')
        .set('Authorization', bearer)
        .send({
          "name": "Channel test 4",
          "type": "PROTECTED",
          "passwordHash": "secret"
        })
        .expect(201)
        .then((response) => {
          protectedChan = response.text.substring(7, 32);
          expect(response.text).toContain('"name":"Channel test 4"');
          expect(response.text).toContain('"type":"PROTECTED"');
        })
    });

    it('/ user C creates a direct message channel', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .post('/channels/create')
        .set('Authorization', bearer)
        .send({
          "name": "Channel test 5",
          "type": "DIRECTMESSAGE",
        })
        .expect(201)
        .then((response) => {
          directMessage = response.text.substring(7, 32);
          expect(response.text).toContain('"name":"Channel test 5"');
          expect(response.text).toContain('"type":"DIRECTMESSAGE"');
        })
    });

    it('/ [ERROR] user C creates a public channel without name', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .post('/channels/create')
        .set('Authorization', bearer)
        .send({})
        .expect(400)
        .then((response) => {
          expect(response.text).toContain('name should not be empty');
        })
    });

    it('/ [ERROR] user C creates a channel with an existing name', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .post('/channels/create')
        .set('Authorization', bearer)
        .send({
          "name": "Channel test 1",
        })
        .expect(403)
        .then((response) => {
          expect(response.text).toContain('"code":"P2002"');
        })
    });

    it('/ [ERROR] user C creates a protected channel with only a password', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .post('/channels/create')
        .set('Authorization', bearer)
        .send({
          "type": "PROTECTED",
          "passwordHash": "secret"
        })
        .expect(400)
        .then((response) => {
          expect(response.text).toContain('name should not be empty');
        })
    });

    it('/ [ERROR] user C creates a protected channel with only a name', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .post('/channels/create')
        .set('Authorization', bearer)
        .send({
          "name": "My Protected Channel",
          "type": "PROTECTED",
        })
        .expect(400)
        .then((response) => {
          expect(response.text).toContain('Protected channel must have a password.');
        })
    });
  })

  /***********************/
  /* GET */
  /***********************/
  describe('Getters of channels', () => {
    it('/ user C gets all channels', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .get('/channels')
        .set('Authorization', bearer)
        .send({})
        .expect(200)
        .then((response) => {
          expect(response.text).toContain('"name":"Channel test 1"');
          expect(response.text).toContain('"name":"Channel test 2"');
          expect(response.text).toContain('"name":"Channel test 3"');
          expect(response.text).toContain('"name":"Channel test 4"');
          expect(response.text).toContain('"name":"Channel test 5"');
        })
    });

    it('/ user C gets all group channels - no direct message', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .get('/channels/get-group-channels')
        .set('Authorization', bearer)
        .send({})
        .expect(200)
        .then((response) => {
          expect(response.text).toContain('"name":"Channel test 1"');
          expect(response.text).toContain('"name":"Channel test 2"');
          expect(response.text).toContain('"name":"Channel test 3"');
          expect(response.text).toContain('"name":"Channel test 4"');
          expect(response.text).not.toContain('"name":"Channel test 5"');
        })
    });

    it('/ user C gets all channels she joined', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .get('/channels/get-all-channels-by-user-id')
        .set('Authorization', bearer)
        .send({})
        .expect(200)
        .then((response) => {
          expect(response.text).toContain('"name":"Channel test 1"');
          expect(response.text).toContain('"name":"Channel test 2"');
          expect(response.text).toContain('"name":"Channel test 3"');
          expect(response.text).not.toContain('"name":"Channel test 4"');
          expect(response.text).toContain('"name":"Channel test 5"');
        })
    });

    it('/ getting the public channel \'Channel test 1\'', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .get('/channels/' + publicChan)
        .set('Authorization', bearer)
        .send({})
        .expect(200)
        .then((response) => {
          expect(response.text).toContain('"name":"Channel test 1"');
          expect(response.text).toContain('"type":"PUBLIC"');
          expect(response.text).not.toContain('"name":"Channel test 2"');
          expect(response.text).not.toContain('"name":"Channel test 3"');
          expect(response.text).not.toContain('"name":"Channel test 4"');
          expect(response.text).not.toContain('"name":"Channel test 5"');
        })
    });

    it('/ getting the Direct Message \'Channel test 5\'', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .get('/channels/' + directMessage)
        .set('Authorization', bearer)
        .send({})
        .expect(200)
        .then((response) => {
          expect(response.text).not.toContain('"name":"Channel test 1"');
          expect(response.text).not.toContain('"name":"Channel test 2"');
          expect(response.text).not.toContain('"name":"Channel test 3"');
          expect(response.text).not.toContain('"name":"Channel test 4"');
          expect(response.text).toContain('"name":"Channel test 5"');
          expect(response.text).toContain('"type":"DIRECTMESSAGE"');
        })
    });

    it('/ getting the private channel \'Channel test 3\'', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .get('/channels/get-user-channel/' + privateChan)
        .set('Authorization', bearer)
        .send({})
        .expect(200)
        .then((response) => {
          expect(response.text).not.toContain('"name":"Channel test 1"');
          expect(response.text).not.toContain('"name":"Channel test 2"');
          expect(response.text).toContain('"name":"Channel test 3"');
          expect(response.text).toContain('"type":"PRIVATE"');
          expect(response.text).not.toContain('"name":"Channel test 4"');
          expect(response.text).not.toContain('"name":"Channel test 5"');
        })
    });

    it('/ getting the protected channel \'Channel test 4\'', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .get('/channels/get-user-channel/' + protectedChan)
        .set('Authorization', bearer)
        .send({})
        .expect(200)
        .then((response) => {
          expect(response.text).not.toContain('"name":"Channel test 4"');
          expect(response.text).not.toContain('"type":"PROTECTED"');
        })
    });

    // To be completed with more users when we have a join channel
    it('/ getting all the users of \'Channel test 1\'', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .get('/channels/get-users-of-a-channel/' + publicChan)
        .set('Authorization', bearer)
        .send({})
        .expect(200)
        .then((response) => {
          expect(response.text).toContain('"nickname":"testchannel1"');
        })
    });

    it('/ getting all the users of a non existing channel', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .get('/channels/get-users-of-a-channel/channel8')
        .set('Authorization', bearer)
        .send({})
        .expect(404)
        .then((response) => {
          console.log(response.text);
        })
    });

    // To be completed with more users with other roles when we have a join channel
    it('/ getting the role of the owner of \'Channel test 1\'', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .get('/channels/get-role-user-channel/' + publicChan)
        .set('Authorization', bearer)
        .send({})
        .expect(200)
        .then((response) => {
          expect(response.text).toContain('"role":"OWNER"');
        })
    });

    it('/ getting the role of the owner of a non existing channel', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .get('/channels/get-role-user-channel/channel8')
        .set('Authorization', bearer)
        .send({})
        .expect(404)
        .then((response) => {
          expect(response.text).toContain('Not found');
        })
    });
  })

  /***********************/
  /* UPDATE */
  /***********************/
  describe('Update of channels', () => {
    it('/ user C updates an existing public channel\'s name', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .patch('/channels/' + publicChan)
        .set('Authorization', bearer)
        .send({
          "name": "Les démons de minuit"
        })
        .expect(200)
        .then((response) => {
          expect(response.text).toContain(
            '"name":"Les démons de minuit","type":"PUBLIC","passwordHash":null');
        })
    });

    it('/ user C updates an existing public channel to private type', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .patch('/channels/' + publicChan)
        .set('Authorization', bearer)
        .send({
          "type": "PRIVATE"
        })
        .expect(200)
        .then((response) => {
          expect(response.text).toContain(
            '"name":"Les démons de minuit","type":"PRIVATE","passwordHash":null');
        })
    });

    it('/ user C updates an existing private channel to protected type\
        with a password', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .patch('/channels/' + privateChan)
        .set('Authorization', bearer)
        .send({
          "type": "PROTECTED",
          "passwordHash": "secret"
        })
        .expect(200)
        .then((response) => {
          expect(response.text).toContain(
            '"name":"Channel test 3","type":"PROTECTED","passwordHash":"secret"');
        })
    });

    it('/ [ERROR] user C updates an existing channel to no name', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .patch('/channels/' + privateChan)
        .set('Authorization', bearer)
        .send({
          "name": "",
        })
        .expect(400)
        .then((response) => {
          expect(response.text).toContain('name should not be empty');
        })
    });

    it('/ [ERROR] user C updates an existing channel to an existing name', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .patch('/channels/' + privateChan)
        .set('Authorization', bearer)
        .send({
          "name": "Les démons de minuit",
        })
        .expect(403)
        .then((response) => {
          expect(response.text).toContain('"code":"P2002"');
        })
    });

    it('/ [ERROR] user C updates an existing channel to no type', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .patch('/channels/' + privateChan)
        .set('Authorization', bearer)
        .send({
          "type": "",
        })
        .expect(403)
    });

    it('/ [ERROR] user C updates an existing channel to a non existing type', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .patch('/channels/' + privateChan)
        .set('Authorization', bearer)
        .send({
          "type": "NOTATYPE",
        })
        .expect(403)
    });

    it('/ [ERROR] user C updates an existing private channel to protected\
      type without a password', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .patch('/channels/' + privateChan)
        .set('Authorization', bearer)
        .send({
          "type": "PROTECTED",
        })
        .expect(400)
        .then((response) => {
          expect(response.text).toContain('Protected channel must have a password');
        })
    });

    it('/ [ERROR] user C updates a non existing channel', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .patch('/channels/channel8')
        .set('Authorization', bearer)
        .send({
          "name": "A channel that doesn't exist",
        })
        .expect(404)
        .then((response) => {
          expect(response.text).toContain('Not found');
        })
    });

    it('/ [ERROR] user D updates a channel\'s name where he is not owner', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestB;
      return request(app.getHttpServer())
        .patch('/channels/' + privateChan)
        .set('Authorization', bearer)
        .send({
          "name": "A channel for which I am not the owner",
        })
        .expect(404)
        .then((response) => {
          expect(response.text).toContain('Not found');
        })
    });

    it('/ [ERROR] user D updates a channel\'s type where he is not owner', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestB;
      return request(app.getHttpServer())
        .patch('/channels/' + privateChan)
        .set('Authorization', bearer)
        .send({
          "type": "PRIVATE",
        })
        .expect(404)
        .then((response) => {
          expect(response.text).toContain('Not found');
        })
    });
  })

  /***********************/
  /* DELETE */
  /***********************/
  describe('Deletion of channels', () => {
    it('/ Deletion of a public channel', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .delete('/channels/' + publicChan)
        .set('Authorization', bearer)
        .send({})
        .expect(204)
    });

    it('/ Deletion of a direct message channel', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .delete('/channels/' + directMessage)
        .set('Authorization', bearer)
        .send({})
        .expect(204)
    });

    it('/ Deletion of a non existing channel', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieTestA;
      return request(app.getHttpServer())
        .delete('/channels/channel8')
        .set('Authorization', bearer)
        .send({})
        .expect(403)
        .then((response) => {
          expect(response.text).toContain('Record to delete does not exist');
        })
    });

    /* Shouldn't be unquoted until we make deletion for ChannelUser (a User leaves a channel) */
    //   it('/ [ERROR] Deletion of a channel where there are still users', async () => {
    //     await new Promise(process.nextTick);
    //     let bearer = 'Bearer ' + cookieTestA;
    //     return request(app.getHttpServer())
    //       .delete('/channels/' + privateChan)
    //       .set('Authorization', bearer)
    //       .send({})
    //       .expect(204)
    //   });

  })

});
