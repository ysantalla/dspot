import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/nestjs-testing';

import { getModelToken } from '@nestjs/mongoose';
import { HttpException, NotFoundException } from '@nestjs/common';
import { Model, DocumentQuery, Query } from 'mongoose';

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
  email = 'ysantalla@gmail.com'
) => {
  return {
    _id,
    lastname,
    firstname,
    email,
    age,
  };
};

// still lazy, but this time using an object instead of multiple parameters
const mockUserDoc: (mock?: {
  _id?: string,
  firstname?: string,
  lastname?: string,
  age?: number,
  email?: string,
}) => Partial<UserDoc> = (mock?: {
  _id: string,
  firstname: string,
  lastname: string,
  age: number,
  email: string,
}) => {
  return {
    _id: (mock && mock._id) || '5f9459bcc987103194740b6c',
    firstname: (mock && mock.firstname) || 'Yasmany',
    lastname: (mock && mock.firstname) || 'Santalla Pereda',    
    age: (mock && mock.age) || 30,
    email: (mock && mock.email) || 'ysantalla@gmail.com',
  };
};

const userArray: User[] = [
  mockUser(),
  mockUser('5f9459bcc987103194740b6c', 'Vitani', 'a new uuid', 2, 'Tabby'),
  mockUser('5f9459bcc987103194740b6c', 'Simba', 'the king', 14, 'Lion'),
];

const userDocArray = [
  mockUserDoc(),
  mockUserDoc({ _id: '5f9459bcc987103194740b6c', firstname: 'Vitani', lastname: 'lastname', age: 2, email: 'tabby@gmail.com' }),
  mockUserDoc({ _id: '5f9459bcc987103194740b6c', firstname: 'Simba', lastname: 'lastname', age: 14, email: 'lion@gmail.com' }),
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
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
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

  describe('findOne', () => {
    describe('when user not found', () => {
      it('should return the http exception error', async () => {        
        const userID = '5f9459bcc987103194740b6c';

        jest.spyOn(model, 'findOne').mockReturnValueOnce(
          createMock<DocumentQuery<UserDoc, UserDoc, unknown>>({
            exec: jest
              .fn()
              .mockRejectedValueOnce(
                new NotFoundException(`User #${userID} not found`)
             )
          }),
        );

        try {
          await service.findOne('5f9459bcc987103194740b6c');
        } catch (err) {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.response.message).toEqual(`User #${userID} not found`);
        }
      });
    });
  });

  describe('findOne', () => {
    it('should return the user found', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(
        createMock<DocumentQuery<UserDoc, UserDoc, unknown>>({
          exec: jest
            .fn()
            .mockResolvedValueOnce(mockUserDoc()),
        }),
      );
      const findMockUser = mockUser();
      const foundUser = await service.findOne('5f9459bcc987103194740b6c');

      expect(foundUser).toEqual(findMockUser);
    });
  });

  describe('count', () => {
    it('should return the user document count', async () => {
      jest.spyOn(model, 'countDocuments').mockReturnValueOnce(createMock<Query<number>>({
        exec: jest
          .fn()
          .mockResolvedValueOnce(10) 
      }));

      const countUser = await service.count();
      expect(countUser).toEqual(10);
    });
  }); 

});
