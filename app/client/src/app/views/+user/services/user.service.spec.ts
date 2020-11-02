import { TestBed } from '@angular/core/testing';

// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Data } from '@angular/router';

import { UserService } from './user.service';
import {environment as env} from '@env/environment';
import { User } from '@app/core/interfaces/user.interface';



export const USER_OBJECT: User = {
  id: '123',
  age: 30,
  email: 'ysantalla88@gmail.com',
  firstname: 'Yasmany',
  lastname: 'Santalla Pereda'
};


describe('UserService', () => {
  let service: UserService;

  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(UserService);


    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
