import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/nestjs-testing';

import { getModelToken } from '@nestjs/mongoose';
import { HttpException } from '@nestjs/common';
import { Model, DocumentQuery } from 'mongoose';

import { UserService } from './user.service';
import { UserDoc } from './entities/user.entity';
import { UserController } from './user.controller';

import { User } from './interfaces/user.interface';


// I'm lazy and like to have functions that can be re-used to deal with a lot of my initialization/creation logic
const mockUser: (
  firstname?: string,
  lastname?: string,
  _id?: string,
  age?: number,
  email?: string,
) => User = (
  firstname = 'Yasmany',
  lastname = 'Santalla Pereda',
  _id = 'uuid',
  age = 30,
  email = 'ysantalla@gmail.com'
) => {
  return {
    _id,
    age,
    lastname,
    firstname,
    email,
  };
};

// still lazy, but this time using an object instead of multiple parameters
const mockUserDoc: (mock?: {
  firstname?: string,
  lastname?: string,
  _id?: string,
  age?: number,
  email?: string,
}) => Partial<UserDoc> = (mock?: {
  firstname: string,
  lastname: string,
  _id: string,
  age: number,
  email: string,
}) => {
  return {
    _id: (mock && mock._id) || 'uuid',
    firstname: (mock && mock.firstname) || 'Yasmany',
    lastname: (mock && mock.firstname) || 'Santalla Pereda',    
    age: (mock && mock.age) || 4,
    email: (mock && mock.email) || 'email@gmail.com',
  };
};

const userArray: User[] = [
  mockUser(),
  mockUser('Vitani', 'a new uuid', 'uuid', 2, 'Tabby'),
  mockUser('Simba', 'the king', 'uuid',14, 'Lion'),
];

const userDocArray = [
  mockUserDoc(),
  mockUserDoc({ firstname: 'Vitani', lastname: 'lastname', _id: 'a new uuid', age: 2, email: 'tabby@gmail.com' }),
  mockUserDoc({ firstname: 'Simba', lastname: 'lastname', age: 14, _id: 'the king', email: 'lion@gmail.com' }),
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
          useValue: UserDoc,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<UserDoc>>(getModelToken(UserDoc.name));
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

  describe('when user not found', () => {
    it('should return the http exception error', async () => {

      jest.spyOn(model, 'findOne').mockReturnValueOnce(
        createMock<DocumentQuery<UserDoc, UserDoc, unknown>>({
          exec: jest
            .fn()
            .mockResolvedValueOnce(mockUserDoc()),
        }),
      );
      const findMockUser = mockUser();

      console.log(findMockUser);
      const foundUser = await service.findOne('5f9459bcc987103194740b6c');

      

      expect(foundUser).toEqual(findMockUser);

    });
  });
 

});
