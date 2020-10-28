import { Test, TestingModule } from '@nestjs/testing';

import { getModelToken } from '@nestjs/mongoose';
import { HttpException, NotFoundException } from '@nestjs/common';
import { Model, DocumentQuery } from 'mongoose';

import { UserService } from './user.service';
import { UserDoc } from './entities/user.entity';
import { UserController } from './user.controller';

import { User } from './interfaces/user.interface';

// I'm lazy and like to have functions that can be re-used to deal with a lot of my initialization/creation logic
const mockUser: (
  _id?: string,
  firstname?: string,
  lastname?: string,
  age?: number,
  email?: string,
) => User = (
  _id = '5f9459bcc987103194740b6c',
  firstname = 'Yasmany',
  lastname = 'Santalla Pereda',
  age = 30,
  email = 'ysantalla@gmail.com',
) => {
  return {
    _id,
    firstname,
    lastname,
    email,
    age,
  };
};

// still lazy, but this time using an object instead of multiple parameters
const mockUserDoc: (mock?: {
  _id?: string;
  firstname?: string;
  lastname?: string;
  age?: number;
  email?: string;
}) => Partial<UserDoc> = (mock?: {
  _id: string;
  firstname: string;
  lastname: string;
  age: number;
  email: string;
}) => {
  return {
    _id: (mock && mock._id) || '5f9459bcc987103194740b6c',
    firstname: (mock && mock.firstname) || 'Yasmany',
    lastname: (mock && mock.lastname) || 'Santalla Pereda',
    age: (mock && mock.age) || 30,
    email: (mock && mock.email) || 'ysantalla@gmail.com',
  };
};

const userArray: User[] = [
  mockUser(),
  mockUser(
    '5f9459bcc987103194740b6c',
    'Vitani',
    'lastname',
    2,
    'tabby@gmail.com',
  ),
  mockUser(
    '5f9459bcc987103194740b6c',
    'Simba',
    'the king',
    14,
    'lion@gmail.com',
  ),
];

const userDocArray = [
  mockUserDoc(),
  mockUserDoc({
    _id: '5f9459bcc987103194740b6c',
    firstname: 'Vitani',
    lastname: 'lastname',
    age: 2,
    email: 'tabby@gmail.com',
  }),
  mockUserDoc({
    _id: '5f9459bcc987103194740b6c',
    firstname: 'Simba',
    lastname: 'the king',
    age: 14,
    email: 'lion@gmail.com',
  }),
];

describe('UserService', () => {
  let service: UserService;
  let model: Model<UserDoc>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getModelToken(UserDoc.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser()),
            constructor: jest.fn().mockResolvedValue(mockUser()),
            countDocuments: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<UserDoc>>(getModelToken(UserDoc.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // In all the spy methods/mock methods we need to make sure to
  // add in the property function exec and tell it what to return
  // this way all of our mongo functions can and will be called
  // properly allowing for us to successfully test them.
  describe('findOne', () => {
    describe('when user with ID is invalid', () => {
      it('should return the http exception error', async () => {
        const userId = '1';

        try {
          await service.findOne(userId);
        } catch (err) {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.response.error).toEqual(
            `Invalid decoding Object ID ${userId}`,
          );
        }
      });
    });

    describe('when user not found', () => {
      it('should return the http exception error', async () => {
        const userID = '5f9459bcc987103194740b6c';

        jest.spyOn(model, 'findOne').mockReturnValueOnce({
            exec: jest
              .fn()
              .mockRejectedValueOnce(
                new NotFoundException(`User #${userID} not found`),
              ),
          } as any
        );

        try {
          await service.findOne(userID);
        } catch (err) {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.response.message).toEqual(`User #${userID} not found`);
        }
      });
    });

    describe('findOne', () => {
      it('should return the user found', async () => {
        jest.spyOn(model, 'findOne').mockReturnValueOnce({
          exec: jest.fn().mockReturnValue(mockUser()),
        } as any);
        const findMockUser = mockUser();
        const foundUser = await service.findOne('5f9459bcc987103194740b6c');

        expect(foundUser).toEqual(findMockUser);
      });
    });
  });

  describe('count', () => {
    it('should return the user document count', async () => {
      jest.spyOn(model, 'countDocuments').mockReturnValueOnce({
          exec: jest.fn().mockResolvedValueOnce(10),
        } as any);

      const countUser = await service.count();
      expect(countUser).toEqual(10);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValueOnce(userDocArray),
        }),
      } as any);
      const users = await service.findAll();

      expect(users).toEqual(userArray);
    });
  });

  describe('create', () => {
    it('should insert a new user', async () => {
      jest.spyOn(model, 'create').mockResolvedValueOnce({
        _id: '5f9459bcc987103194740b6c',
        firstname: 'Simba',
        lastname: 'The king',
        age: 2,
        email: 'simba@gmail.com',
      } as any); // dreaded as any, but it can't be helped

      const newUser = await service.create({
        firstname: 'Simba',
        lastname: 'The king',
        age: 2,
        email: 'simba@gmail.com',
      });
      expect(newUser).toEqual(
        mockUser(
          '5f9459bcc987103194740b6c',
          'Simba',
          'The king',
          2,
          'simba@gmail.com',
        ),
      );
    });
  });

  describe('remove', () => {
    it('invalid user id', async () => {
      const userId = '1';

      try {
        await service.remove(userId);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.error).toEqual(
          `Invalid decoding Object ID ${userId}`,
        );
      }
    });

    it('should return the http exception error', async () => {
      const userID = '5f9459bcc987103194740b6c';

      jest.spyOn(model, 'deleteOne').mockReturnValueOnce({
          lean: jest
            .fn()
            .mockRejectedValueOnce(
              new NotFoundException(`User #${userID} not found`),
            ),
        } as any
      );

      try {
        await service.remove(userID);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.message).toEqual(`User #${userID} not found`);
      }
    });

    it('remove user by id', async () => {
      jest.spyOn(model, 'deleteOne').mockReturnValue({
        lean: jest.fn().mockReturnValue(mockUser()),
      } as any);

      const deletedUser = await service.remove('5f9459bcc987103194740b6c');
      expect(deletedUser).toEqual(mockUser());
    });
  });

  describe('update', () => {
    it('invalid user id', async () => {
      const userId = '1';

      try {
        await service.update(userId, {});
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.error).toEqual(
          `Invalid decoding Object ID ${userId}`,
        );
      }
    });

    it('should return the http exception error', async () => {
      const userID = '5f9459bcc987103194740b6c';

      jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce({
          lean: jest
            .fn()
            .mockRejectedValueOnce(
              new NotFoundException(`User #${userID} not found`),
            ),
        } as any
      );

      try {
        await service.update(userID, {});
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.message).toEqual(`User #${userID} not found`);
      }
    });

    it('update user by id', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
        lean: jest.fn().mockReturnValue(mockUser('5f9459bcc987103194740b6c', 'Simba', 'the king', 15, 'lion@gmail.com')),
      } as any);

      const updatedUser = await service.update('5f9459bcc987103194740b6c', {
        firstname: 'Simba',
        lastname: 'the king',
        age: 15,
        email: 'lion@gmail.com',
      });
      expect(updatedUser).toEqual(mockUser('5f9459bcc987103194740b6c', 'Simba', 'the king', 15, 'lion@gmail.com'));
    });

  });
});
