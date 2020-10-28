import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComponent } from './create.component';
import { UserService } from '../services/user.service';

class MockUserService {
  isLoggedIn = true;
  user = { name: 'Test User'};
}

describe('CreateComponent', () => {
  let component: CreateComponent;
  let userService: UserService;
  let fixture: ComponentFixture<CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateComponent ],
      providers: [
        { provide: UserService, useClass: MockUserService }
      ]
    })
    .compileComponents();

    component = TestBed.inject(CreateComponent);
    userService = TestBed.inject(UserService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
