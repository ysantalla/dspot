import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateComponent } from './create.component';
import { UserService } from '../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('CreateComponent', () => {
  let component: CreateComponent;
  let userService: UserService;
  let fixture: ComponentFixture<CreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        SharedModule.forRoot(),
        FormsModule, ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [ CreateComponent ],
      providers: [
        CreateComponent,
        UserService,
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
