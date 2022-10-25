import { Test } from '@nestjs/testing';
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

    prisma = app.get(PrismaService);

  });

  afterAll(
    async () => {
      const deleteMatch = prisma.match.deleteMany()
      const deleteMessage = prisma.message.deleteMany()
      const deleteBan = prisma.ban.deleteMany()
      const deleteChannel = prisma.channel.deleteMany()
      const deleteFriendship = prisma.friendship.deleteMany()
      const deleteUser = prisma.user.deleteMany()

      await prisma.$transaction([
        deleteMatch,
        deleteMessage,
        deleteBan,
        deleteChannel,
        deleteFriendship,
        deleteUser,
      ])

    await prisma.$disconnect()
    app.close();
  });

  let cookieA: string;
  let cookieB: string;

  /******************************************************************************/
  /* TEMPLATE TESTS */
  /******************************************************************************/

  describe('Create data for tests', () => {
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
  })

  describe('Create your tests', () => {})


});
