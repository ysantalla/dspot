import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserDoc } from './entities/user.entity';
import { User } from './interfaces/user.interface';

describe('UserController', () => {
  let controller: UserController;
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

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("* Find One By Id", () => {
    it("should return an user interface of client if successful", async () => {
      const expectedResult: User = {
        age: 30,
        email: "email@gmail.com",
        firstname: "Yasmany",
        lastname: "Santalla Pereda",
        id: "5f9459bcc987103194740b6c"
      };
      const mockId = "15f9459bcc987103194740b6c23";
      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult);
      expect(await controller.findOne(mockId)).toBe(expectedResult);
    });
   });

});
