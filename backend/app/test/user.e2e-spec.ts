// import { Test } from '@nestjs/testing';
// import { INestApplication, ValidationPipe } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from '../src/app.module';
// import { PrismaService } from '../src/prisma/prisma.service';

// describe('User Controller (e2e)', () => {
//   let app: INestApplication;
//   let prisma: PrismaService;

//   beforeAll(async () => {
//     const moduleRef =
//       await Test.createTestingModule({
//         imports: [AppModule],
//       }).compile();

//     app = moduleRef.createNestApplication();
//     app.useGlobalPipes(
//       new ValidationPipe({
//         whitelist: true,
//       }),
//     );
//     await app.init();

//     prisma = app.get(PrismaService);

//   });

//   afterAll(
//     async () => {
//       const deleteFriendship = prisma.friendship.deleteMany()

//       await prisma.$transaction([
//         deleteFriendship,
//       ])

//     await prisma.$disconnect()
//     app.close();
//   });

//   let cookieA: string;
//   let cookieB: string;
//   let cookieC: string;
//   let cookieD: string;

//   /******************************************************************************/
//   /* USERS TESTS */
//   /******************************************************************************/

//   describe('User', () => {
//     it('/ (create test users)', async () => {
//       return request(app.getHttpServer())
//         .post('/auth/create-user-dev')
//         .send({
//           nickname: 'a',
//           immutableId: 'i',
//           passwordHash: 'b'
//         })
//         .expect(201)
//         .then((response) => {
//           cookieA = response.text;
//         })
//     });

//     it('/ (create test users)', async () => {
//       return request(app.getHttpServer())
//         .post('/auth/create-user-dev')
//         .send({
//           nickname: 'b',
//           immutableId: 'j',
//           passwordHash: 'd'
//         })
//         .expect(201)
//         .then((response) => {
//           cookieB = response.text;
//         })
//     });

//     it('/ (create test users)', async () => {
//       return request(app.getHttpServer())
//         .post('/auth/create-user-dev')
//         .send({
//           nickname: 'c',
//           immutableId: 'k',
//           passwordHash: 'd'
//         })
//         .expect(201)
//         .expect(201)
//         .then((response) => {
//           cookieC = response.text;
//         })
//     });

//     it('/ (create test users)', async () => {
//       return request(app.getHttpServer())
//         .post('/auth/create-user-dev')
//         .send({
//           nickname: 'd',
//           immutableId: 'l',
//           passwordHash: 'd'
//         })
//         .expect(201)
//         .then((response) => {
//           cookieD = response.text;
//         })
//     });

//     it('/ (attempt to create duplicate user)', async () => {
//       return request(app.getHttpServer())
//         .post('/auth/create-user-dev')
//         .send({
//           nickname: 'd',
//           immutableId: 'l',
//           passwordHash: 'd'
//         })
//         .expect(304)
//     });
//   })

//   /******************************************************************************/
//   /* FRIENDSHIP TESTS */
//   /******************************************************************************/

//   describe('Friends', () => {
//     it('/ (user a requests user b as friend)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieA;

//         return request(app.getHttpServer())
//           .post('/user/request-friend')
//           .set('Authorization', bearer)
//           .send({
//             target: 'b'
//           })
//           .expect(201)
//       });

//       it('/ (should return empty list)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieD;
//         return request(app.getHttpServer())
//           .get('/user/get-user-friend-requests')
//           .set('Authorization', bearer)
//           .send()
//           .expect(200)
//           .then((response) => {
//             expect(response.text).toContain('[]');
//           })
//       });

//       it('/ (user c requests user d as friend)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieC;
//         return request(app.getHttpServer())
//           .post('/user/request-friend')
//           .set('Authorization', bearer)
//           .send({
//             target: 'd'
//           })
//           .expect(201)
//       });

//       it('/ (should return 401)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + 'some random string';
//         return request(app.getHttpServer())
//           .get('/user/get-user-info')
//           .set('Authorization', bearer)
//           .send()
//           .expect(401)
//       });

//       it('/ (should return info about user d)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieD;
//         return request(app.getHttpServer())
//           .get('/user/get-user-info')
//           .set('Authorization', bearer)
//           .send()
//           .expect(200)
//           .then((response) => {
//             expect(response.text).toContain('"nickname":"d"');
//           })
//       });

//       it('/ (should return info about user c)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieD;
//         return request(app.getHttpServer())
//           .get('/user/get-user-friend-requests')
//           .set('Authorization', bearer)
//           .send()
//           .expect(200)
//           .then((response) => {
//             expect(response.text).toContain('"nickname":"c"');
//           })
//       });

//       it('/ (should not return info about user c)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieD;
//         return request(app.getHttpServer())
//           .get('/user/get-user-friends')
//           .set('Authorization', bearer)
//           .send()
//           .expect(200)
//           .then((response) => {
//             expect(response.text).toEqual('[]');
//           })
//       });


//       it('/ (user c requests non existant user as friend)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieC;
//         return request(app.getHttpServer())
//           .post('/user/request-friend')
//           .set('Authorization', bearer)
//           .send({
//             target: 'e'
//           })
//           .expect(500)
//       });

//       it('/ (user b accepts a as friend)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieB;
//         return request(app.getHttpServer())
//           .put('/user/update-friendship')
//           .set('Authorization', bearer)
//           .send({
//             target: 'a',
//             friends: true
//           })
//           .expect(200)
//       });

//       it('/ (should return info about user a)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieB;
//         return request(app.getHttpServer())
//           .get('/user/get-user-friends')
//           .set('Authorization', bearer)
//           .send()
//           .expect(200)
//           .then((response) => {
//             expect(response.text).toContain('"nickname":"a"');
//           })
//       });

//       it('/ (user b accepts friend request that does not exist)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieB;
//         return request(app.getHttpServer())
//           .put('/user/update-friendship')
//           .set('Authorization', bearer)
//           .send({
//             target: 'd',
//             friends: true
//           })
//           .expect(500)
//       });

//       it('/ (user b accepts a as friend again)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieB;
//         return request(app.getHttpServer())
//           .put('/user/update-friendship')
//           .set('Authorization', bearer)
//           .send({
//             target: 'a',
//             friends: true
//           })
//           .expect(200)
//       });

//       it('/ (user a unfriends user b)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieA;
//         return request(app.getHttpServer())
//           .put('/user/update-friendship')
//           .set('Authorization', bearer)
//           .send({
//             target: 'b',
//             friends: false
//           })
//           .expect(200)
//       });

//       it('/ (user a unfriends user b again)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieA;
//         return request(app.getHttpServer())
//           .put('/user/update-friendship')
//           .set('Authorization', bearer)
//           .send({
//             target: 'b',
//             friends: false
//           })
//           .expect(500)
//       });

//       it('/ (user b accepts friend request that does not exist)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieB;
//         return request(app.getHttpServer())
//           .put('/user/update-friendship')
//           .set('Authorization', bearer)
//           .send({
//             target: 'a',
//             friends: true
//           })
//           .expect(500)
//       });

//       it('/ (delete test users)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieA;
//         return request(app.getHttpServer())
//           .delete('/user/delete')
//           .set('Authorization', bearer)
//           .send({
//             nickname: 'a',
//           })
//           .expect(204)
//       });
//     })

//     describe('Delete User', () => {
//       it('/ (attempt to delete a user that does not exist)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieA;
//         return request(app.getHttpServer())
//           .delete('/user/delete')
//           .set('Authorization', bearer)
//           .send({
//             nickname: 'a',
//           })
//           .expect(204)
//       });

//       it('/ (delete test users)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieB;
//         return request(app.getHttpServer())
//           .delete('/user/delete')
//           .set('Authorization', bearer)
//           .send({
//             nickname: 'b',
//           })
//           .expect(204)
//       });

//       it('/ (delete test users)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieC;
//         return request(app.getHttpServer())
//         .delete('/user/delete')
//         .set('Authorization', bearer)
//         .send({
//           nickname: 'c',
//         })
//         .expect(204)
//       });

//       it('/ (delete test users)', async () => {
//         await new Promise(process.nextTick);
//         let bearer = 'Bearer ' + cookieD;
//         return request(app.getHttpServer())
//         .delete('/user/delete')
//         .set('Authorization', bearer)
//         .send({
//           nickname: 'd',
//         })
//         .expect(204)
//       });
//     })
// });
