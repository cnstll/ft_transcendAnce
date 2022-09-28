import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as request from 'supertest';
import { AuthController } from './auth.controller';

describe('MyService', () => {
  let controller: AuthController;
  const mockPrismaService = {
    userCreate: jest.fn(dto => {
      return {
        id: "this",
        ...dto
      }
    })
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).overrideProvider(AuthService).useValue(mockPrismaService).compile();
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create a user', () => {
    expect(controller.signup({ name: 'a' })).toEqual(
      {
        id: expect.any(String),
        name: 'a'
      }
    );
  });

});
