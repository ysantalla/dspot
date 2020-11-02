import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserService } from '../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ListComponent } from './list.component';


describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        SharedModule.forRoot(),
        FormsModule, ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [ ListComponent ],
      providers: [
        ListComponent,
        UserService,
      ]
    })
    .compileComponents();

    component = TestBed.inject(ListComponent);
    userService = TestBed.inject(UserService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
