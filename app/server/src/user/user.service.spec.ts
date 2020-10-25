import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserDoc } from './entities/user.entity';
import { UserController } from './user.controller';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException } from '@nestjs/common';


// type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
// const createMockRepository = <T = any>(): MockRepository<T> => ({
//   findOne: jest.fn(),
//   create: jest.fn(),
// });

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken(UserDoc.name),
          useValue: UserDoc,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when user with ID is invalid', () => {
      it('should return the http exception error', async () => {
        const userId = '1';

        try {
          await service.findOne(userId);
        } catch (err) {

          expect(err).toBeInstanceOf(HttpException);
          expect(err.response.error).toEqual(`Invalid decoding Object ID ${userId}`);
        }
      });
    });
  });

  // describe('when user not found', () => {
  //   it('should return the http exception error', async () => {
  //     const userId = '5f9459bcc987103194740b22';

  //     try {
  //       await service.findOne(userId);
  //     } catch (err) {

  //       expect(err).toBeInstanceOf(HttpException);
  //       expect(err.response.error).toEqual(`User #${userId} not found`);
  //     }
  //   });
  // });

});
