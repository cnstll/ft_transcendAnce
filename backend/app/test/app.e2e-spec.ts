import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
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

    // prisma = app.get(PrismaService);
    // await prisma.cleanDb;
  });

  afterAll(() => {
    app.close();
  });


  let cookieA: string;
  let cookieB: string;
  let cookieC: string;
  let cookieD: string;

  /******************************************************************************/
  /* USERS TESTS */
  /******************************************************************************/

  describe('User', () => {
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

    it('/ (create test users)', async () => {
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

    it('/ (create test users)', async () => {
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

    it('/ (attempt to create duplicate user)', async () => {
      return request(app.getHttpServer())
        .post('/auth/create-user-dev')
        .send({
          nickName: 'd',
          passwordHash: 'd'
        })
        .expect(403)
    });
  })

  /******************************************************************************/
  /* FRIENDS TESTS */
  /******************************************************************************/

  // describe('Friends', () => {
  //   it('/ (user a requests user b as friend)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieA;

  //       return request(app.getHttpServer())
  //         .post('/user/request-friend')
  //         .set('Authorization', bearer)
  //         .send({
  //           target: 'b'
  //         })
  //         .expect(201)
  //     });

  //     it('/ (should return empty list)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieD;
  //       return request(app.getHttpServer())
  //         .get('/user/get-user-friend-requests')
  //         .set('Authorization', bearer)
  //         .send()
  //         .expect(200)
  //         .then((response) => {
  //           expect(response.text).toContain('[]');
  //         })
  //     });

  //     it('/ (user c requests user d as friend)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieC;
  //       return request(app.getHttpServer())
  //         .post('/user/request-friend')
  //         .set('Authorization', bearer)
  //         .send({
  //           target: 'd'
  //         })
  //         .expect(201)
  //     });

  //     it('/ (should return 401)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + 'some random string';
  //       return request(app.getHttpServer())
  //         .get('/user/get-user-info')
  //         .set('Authorization', bearer)
  //         .send()
  //         .expect(401)
  //     });

  //     it('/ (should return info about user d)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieD;
  //       return request(app.getHttpServer())
  //         .get('/user/get-user-info')
  //         .set('Authorization', bearer)
  //         .send()
  //         .expect(200)
  //         .then((response) => {
  //           expect(response.text).toContain('"nickname":"d"');
  //         })
  //     });

  //     it('/ (should return info about user c)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieD;
  //       return request(app.getHttpServer())
  //         .get('/user/get-user-friend-requests')
  //         .set('Authorization', bearer)
  //         .send()
  //         .expect(200)
  //         .then((response) => {
  //           expect(response.text).toContain('"nickname":"c"');
  //         })
  //     });

  //     it('/ (should not return info about user c)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieD;
  //       return request(app.getHttpServer())
  //         .get('/user/get-user-friends')
  //         .set('Authorization', bearer)
  //         .send()
  //         .expect(200)
  //         .then((response) => {
  //           expect(response.text).toEqual('[]');
  //         })
  //     });


  //     it('/ (user c requests non existant user as friend)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieC;
  //       return request(app.getHttpServer())
  //         .post('/user/request-friend')
  //         .set('Authorization', bearer)
  //         .send({
  //           target: 'e'
  //         })
  //         .expect(500)
  //     });

  //     it('/ (user b accepts a as friend)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieB;
  //       return request(app.getHttpServer())
  //         .put('/user/update-friendship')
  //         .set('Authorization', bearer)
  //         .send({
  //           target: 'a',
  //           friends: true
  //         })
  //         .expect(200)
  //     });

  //     it('/ (should return info about user a)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieB;
  //       return request(app.getHttpServer())
  //         .get('/user/get-user-friends')
  //         .set('Authorization', bearer)
  //         .send()
  //         .expect(200)
  //         .then((response) => {
  //           expect(response.text).toContain('"nickname":"a"');
  //         })
  //     });

  //     it('/ (user b accepts friend request that does not exist)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieB;
  //       return request(app.getHttpServer())
  //         .put('/user/update-friendship')
  //         .set('Authorization', bearer)
  //         .send({
  //           target: 'd',
  //           friends: true
  //         })
  //         .expect(500)
  //     });

  //     it('/ (user b accepts a as friend again)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieB;
  //       return request(app.getHttpServer())
  //         .put('/user/update-friendship')
  //         .set('Authorization', bearer)
  //         .send({
  //           target: 'a',
  //           friends: true
  //         })
  //         .expect(200)
  //     });

  //     it('/ (user a unfriends user b)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieA;
  //       return request(app.getHttpServer())
  //         .put('/user/update-friendship')
  //         .set('Authorization', bearer)
  //         .send({
  //           target: 'b',
  //           friends: false
  //         })
  //         .expect(200)
  //     });

  //     it('/ (user a unfriends user b again)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieA;
  //       return request(app.getHttpServer())
  //         .put('/user/update-friendship')
  //         .set('Authorization', bearer)
  //         .send({
  //           target: 'b',
  //           friends: false
  //         })
  //         .expect(500)
  //     });

  //     it('/ (user b accepts friend request that does not exist)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieB;
  //       return request(app.getHttpServer())
  //         .put('/user/update-friendship')
  //         .set('Authorization', bearer)
  //         .send({
  //           target: 'a',
  //           friends: true
  //         })
  //         .expect(500)
  //     });

  //     it('/ (delete test users)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieA;
  //       return request(app.getHttpServer())
  //         .delete('/user/delete')
  //         .set('Authorization', bearer)
  //         .send({
  //           nickName: 'a',
  //         })
  //         .expect(204)
  //     });

  //     it('/ (attempt to delete a user that does not exist)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieA;
  //       return request(app.getHttpServer())
  //         .delete('/user/delete')
  //         .set('Authorization', bearer)
  //         .send({
  //           nickName: 'a',
  //         })
  //         .expect(204)
  //     });

  //     it('/ (delete test users)', async () => {
  //       await new Promise(process.nextTick);
  //       let bearer = 'Bearer ' + cookieB;
  //       return request(app.getHttpServer())
  //         .delete('/user/delete')
  //         .set('Authorization', bearer)
  //         .send({
  //           nickName: 'b',
  //         })
  //         .expect(204)
  //     });
  // })

  /******************************************************************************/
  /* CHANNELS TESTS */
  /******************************************************************************/

  describe('Channels', () => {
  let publicChan: string;
  let privateChan: string;
  let protectedChan: string;
  let directMessage: string;

  /***********************/
  /* CREATE */
  /***********************/
  it('/ user C creates a default public channel with a name', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieC;
    return request(app.getHttpServer())
      .post('/channels/create')
      .set('Authorization', bearer)
      .send({
        "name":"Channel test 1",
      })
      .expect(201)
      .then((response) => {
        publicChan = response.text.substring(7,32);
        expect(response.text).toContain('"name":"Channel test 1"');
        expect(response.text).toContain('"type":"PUBLIC"');
      })
  });

  it('/ user C creates a public channel with a name', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieC;
    return request(app.getHttpServer())
      .post('/channels/create')
      .set('Authorization', bearer)
      .send({
        "name":"Channel test 2",
        "type":"PUBLIC"
      })
      .expect(201)
      .then((response) => {
        expect(response.text).toContain('"name":"Channel test 2"');
        expect(response.text).toContain('"type":"PUBLIC"');
      })
  });

  it('/ user C creates a private channel with a name', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieC;
    return request(app.getHttpServer())
      .post('/channels/create')
      .set('Authorization', bearer)
      .send({
        "name":"Channel test 3",
        "type":"PRIVATE",
      })
      .expect(201)
      .then((response) => {
        privateChan = response.text.substring(7,32);
        expect(response.text).toContain('"name":"Channel test 3"');
        expect(response.text).toContain('"type":"PRIVATE"');
      })
  });

  it('/ user D creates a protected channel with a name + password', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieD;
    return request(app.getHttpServer())
      .post('/channels/create')
      .set('Authorization', bearer)
      .send({
        "name":"Channel test 4",
        "type":"PROTECTED",
        "passwordHash":"secret"
      })
      .expect(201)
      .then((response) => {
        protectedChan = response.text.substring(7,32);
        expect(response.text).toContain('"name":"Channel test 4"');
        expect(response.text).toContain('"type":"PROTECTED"');
      })
  });

  it('/ user C creates a direct message channel', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieC;
    return request(app.getHttpServer())
      .post('/channels/create')
      .set('Authorization', bearer)
      .send({
        "name":"Channel test 5",
        "type":"DIRECTMESSAGE",
      })
      .expect(201)
      .then((response) => {
        directMessage = response.text.substring(7,32);
        expect(response.text).toContain('"name":"Channel test 5"');
        expect(response.text).toContain('"type":"DIRECTMESSAGE"');
      })
  });

  it('/ [ERROR] user C creates a public channel without name', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieC;
    return request(app.getHttpServer())
      .post('/channels/create')
      .set('Authorization', bearer)
      .send({})
      .expect(400)
  });

  it('/ [ERROR] user C creates a channel with an existing name', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieC;
    return request(app.getHttpServer())
      .post('/channels/create')
      .set('Authorization', bearer)
      .send({
        "name":"Channel test 1",
      })
      .expect(400)
  });

  it('/ [ERROR] user C creates a protected channel with only a password', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieC;
    return request(app.getHttpServer())
      .post('/channels/create')
      .set('Authorization', bearer)
      .send({
        "type":"PROTECTED",
        "passwordHash":"secret"
      })
      .expect(400)
  });

  it('/ [ERROR] user C creates a protected channel with only a name', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieC;
    return request(app.getHttpServer())
      .post('/channels/create')
      .set('Authorization', bearer)
      .send({
        "name":"My Protected Channel",
        "type":"PROTECTED",
      })
      .expect(400)
  });

  /***********************/
  /* GET */
  /***********************/

  // it('/ user C gets all channels', async () => {
  //   await new Promise(process.nextTick);
  //   let bearer = 'Bearer ' + cookieC;
  //   return request(app.getHttpServer())
  //     .get('/channels')
  //     .set('Authorization', bearer)
  //     .send({})
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.text).toContain('"name":"Channel test 1"');
  //       expect(response.text).toContain('"name":"Channel test 2"');
  //       expect(response.text).toContain('"name":"Channel test 3"');
  //       expect(response.text).toContain('"name":"Channel test 4"');
  //       expect(response.text).toContain('"name":"Channel test 5"');
  //     })
  // });

  // it('/ user C gets all group channels - no direct message', async () => {
  //   await new Promise(process.nextTick);
  //   let bearer = 'Bearer ' + cookieC;
  //   return request(app.getHttpServer())
  //     .get('/channels/get-group-channels')
  //     .set('Authorization', bearer)
  //     .send({})
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.text).toContain('"name":"Channel test 1"');
  //       expect(response.text).toContain('"name":"Channel test 2"');
  //       expect(response.text).toContain('"name":"Channel test 3"');
  //       expect(response.text).toContain('"name":"Channel test 4"');
  //       expect(response.text).not.toContain('"name":"Channel test 5"');
  //     })
  // });

  // it('/ user C gets all channels she joined', async () => {
  //   await new Promise(process.nextTick);
  //   let bearer = 'Bearer ' + cookieC;
  //   return request(app.getHttpServer())
  //     .get('/channels/get-by-user-id')
  //     .set('Authorization', bearer)
  //     .send({})
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.text).toContain('"name":"Channel test 1"');
  //       expect(response.text).toContain('"name":"Channel test 2"');
  //       expect(response.text).toContain('"name":"Channel test 3"');
  //       expect(response.text).not.toContain('"name":"Channel test 4"');
  //       expect(response.text).toContain('"name":"Channel test 5"');
  //     })
  // });

  // it('/ getting the public channel \'Channel test 1\'', async () => {
  //   await new Promise(process.nextTick);
  //   let bearer = 'Bearer ' + cookieC;
  //   return request(app.getHttpServer())
  //     .get('/channels/' + publicChan)
  //     .set('Authorization', bearer)
  //     .send({})
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.text).toContain('"name":"Channel test 1"');
  //       expect(response.text).toContain('"type":"PUBLIC"');
  //       expect(response.text).not.toContain('"name":"Channel test 2"');
  //       expect(response.text).not.toContain('"name":"Channel test 3"');
  //       expect(response.text).not.toContain('"name":"Channel test 4"');
  //       expect(response.text).not.toContain('"name":"Channel test 5"');
  //     })
  // });

  // it('/ getting the Direct Message \'Channel test 5\'', async () => {
  //   await new Promise(process.nextTick);
  //   let bearer = 'Bearer ' + cookieC;
  //   return request(app.getHttpServer())
  //     .get('/channels/' + directMessage)
  //     .set('Authorization', bearer)
  //     .send({})
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.text).not.toContain('"name":"Channel test 1"');
  //       expect(response.text).not.toContain('"name":"Channel test 2"');
  //       expect(response.text).not.toContain('"name":"Channel test 3"');
  //       expect(response.text).not.toContain('"name":"Channel test 4"');
  //       expect(response.text).toContain('"name":"Channel test 5"');
  //       expect(response.text).toContain('"type":"DIRECTMESSAGE"');
  //     })
  // });

  // it('/ getting the private channel \'Channel test 3\'', async () => {
  //   await new Promise(process.nextTick);
  //   let bearer = 'Bearer ' + cookieC;
  //   return request(app.getHttpServer())
  //     .get('/channels/get-user-channel/' + privateChan)
  //     .set('Authorization', bearer)
  //     .send({})
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.text).not.toContain('"name":"Channel test 1"');
  //       expect(response.text).not.toContain('"name":"Channel test 2"');
  //       expect(response.text).toContain('"name":"Channel test 3"');
  //       expect(response.text).toContain('"type":"PRIVATE"');
  //       expect(response.text).not.toContain('"name":"Channel test 4"');
  //       expect(response.text).not.toContain('"name":"Channel test 5"');
  //     })
  // });

  // it('/ getting the protected channel \'Channel test 4\'', async () => {
  //   await new Promise(process.nextTick);
  //   let bearer = 'Bearer ' + cookieC;
  //   return request(app.getHttpServer())
  //     .get('/channels/get-user-channel/' + protectedChan)
  //     .set('Authorization', bearer)
  //     .send({})
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.text).not.toContain('"name":"Channel test 4"');
  //       expect(response.text).not.toContain('"type":"PROTECTED"');
  //     })
  // });

  // // To be completed with more users when we have a join channel
  // it('/ getting all the users of \'Channel test 1\'', async () => {
  //   await new Promise(process.nextTick);
  //   let bearer = 'Bearer ' + cookieC;
  //   return request(app.getHttpServer())
  //     .get('/channels/get-users-of-a-channel/' + publicChan)
  //     .set('Authorization', bearer)
  //     .send({})
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.text).toContain('"nickName":"c"');
  //     })
  // });

  // // To be completed with more users when we have a join channel
  // it('/ getting all the users of \'Channel test 1\'', async () => {
  //   await new Promise(process.nextTick);
  //   let bearer = 'Bearer ' + cookieC;
  //   return request(app.getHttpServer())
  //     .get('/channels/get-role-user-channel/' + publicChan)
  //     .set('Authorization', bearer)
  //     .send({})
  //     .expect(200)
  //     .then((response) => {
  //       expect(response.text).toContain('"role":"OWNER"');
  //     })
  // });

  /***********************/
  /* UPDATE */
  /***********************/

  it('/ user C updates an existing public channel\'s name', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieC;
    return request(app.getHttpServer())
      .patch('/channels/' + publicChan)
      .set('Authorization', bearer)
      .send({
        "name":"Les démons de minuit"
      })
      .expect(200)
      .then((response) => {
        expect(response.text).toContain('"name":"Les démons de minuit"');
      })
  });

  it('/ user C updates an existing public channel to private type', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieC;
    return request(app.getHttpServer())
      .patch('/channels/' + publicChan)
      .set('Authorization', bearer)
      .send({
        "type":"PRIVATE"
      })
      .expect(200)
      .then((response) => {
        expect(response.text).toContain('"type":"PRIVATE"');
      })
  });

  it('/ user C updates an existing private channel to protected type with a password', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieC;
    return request(app.getHttpServer())
      .patch('/channels/' + privateChan)
      .set('Authorization', bearer)
      .send({
        "type":"PROTECTED",
        "passwordHash": "secret"
      })
      .expect(200)
      .then((response) => {
        expect(response.text).toContain('"type":"PROTECTED"');
        expect(response.text).toContain('"passwordHash":"secret"');
      })
  });

  it('/ [ERROR] user C updates an existing channel to no name', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieC;
    return request(app.getHttpServer())
      .patch('/channels/' + privateChan)
      .set('Authorization', bearer)
      .send({
        "name":"",
      })
      .expect(400)
      .then((response) => {
        console.log(response);
      })
  });

  it('/ [ERROR] user C updates an existing channel to an existing name', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieC;
    return request(app.getHttpServer())
      .patch('/channels/' + privateChan)
      .set('Authorization', bearer)
      .send({
        "name":"Les démons de minuit",
      })
      .expect(400)
  });

  it('/ [ERROR] user C updates an existing channel to no type', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieC;
    return request(app.getHttpServer())
      .patch('/channels/' + privateChan)
      .set('Authorization', bearer)
      .send({
        "type":"",
      })
      .expect(403)
  });

  it('/ [ERROR] user C updates an existing private channel to protected\
    type without a password', async () => {
      await new Promise(process.nextTick);
      let bearer = 'Bearer ' + cookieC;
      return request(app.getHttpServer())
        .patch('/channels/' + privateChan)
        .set('Authorization', bearer)
        .send({
          "type":"PROTECTED",
        })
        .expect(400)
  });

  it('/ [ERROR] user C updates a non existing channel', async () => {
    await new Promise(process.nextTick);
    let bearer = 'Bearer ' + cookieC;
    return request(app.getHttpServer())
      .patch('/channels/channel8')
      .set('Authorization', bearer)
      .send({
        "name":"A channel that doesn't exist",
      })
      .expect(404)
  });

  // it('/ ([ERROR] user D updates a channel\'s name where he is not owner)', async () => {
  //   await new Promise(process.nextTick);
  //   let bearer = 'Bearer ' + cookieD;
  //   return request(app.getHttpServer())
  //     .put('/channels/channel1')
  //     .set('Authorization', bearer)
  //     .send({
  //       "name":"A channel for which I am not the owner",
  //     })
  //     .expect(400)
  // });

  // it('/ ([ERROR] user D updates a channel\'s type where he is not owner)', async () => {
  //   await new Promise(process.nextTick);
  //   let bearer = 'Bearer ' + cookieD;
  //   return request(app.getHttpServer())
  //     .put('/channels/channel1')
  //     .set('Authorization', bearer)
  //     .send({
  //       "type":"PRIVATE",
  //     })
  //     .expect(400)
  // });

  //   /* DELETE */

  // it('/ (Deletion of a public channel)', async () => {
  //   await new Promise(process.nextTick);
  //   let bearer = 'Bearer ' + cookieC;
  //   return request(app.getHttpServer())
  //     .delete('/channels/channel4')
  //     .set('Authorization', bearer)
  //     .send({})
  //     .expect(204)
  // });

  // it('/ (Deletion of a private channel)', async () => {
  //   await new Promise(process.nextTick);
  //   let bearer = 'Bearer ' + cookieC;
  //   return request(app.getHttpServer())
  //     .delete('/channels/channel5')
  //     .set('Authorization', bearer)
  //     .send({})
  //     .expect(204)
  // });

  /* Shouldn't be unquoted until we make deletion for ChannelUser (a User leaves a channel) */
  //   it('/ (Deletion of a public channel)', async () => {
  //   await new Promise(process.nextTick);
  //   let bearer = 'Bearer ' + cookieA;
  //   return request(app.getHttpServer())
  //     .delete('/channels/channel3')
  //     .set('Authorization', bearer)
  //     .send({})
  //     .expect(200)
  // });
  })


    // it('/ (delete test users)', async () => {
    //   await new Promise(process.nextTick);
    //   let bearer = 'Bearer ' + cookieC;
    //   return request(app.getHttpServer())
    //     .delete('/user/delete')
    //     .set('Authorization', bearer)
    //     .send({
    //       nickName: 'c',
    //     })
    //     .expect(204)
    // });

    // it('/ (delete test users)', async () => {
    //   await new Promise(process.nextTick);
    //   let bearer = 'Bearer ' + cookieD;
    //   return request(app.getHttpServer())
    //     .delete('/user/delete')
    //     .set('Authorization', bearer)
    //     .send({
    //       nickName: 'd',
    //     })
    //     .expect(204)
    // });
});
