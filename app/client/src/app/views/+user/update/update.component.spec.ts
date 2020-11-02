import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateComponent } from './update.component';
import { UserService } from '../services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { USER_OBJECT } from '../services/user.service.spec';


describe('UpdateComponent', () => {
  let component: UpdateComponent;
  let userService: UserService;
  let fixture: ComponentFixture<UpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        SharedModule.forRoot(),
        FormsModule, ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [ UpdateComponent ],
      providers: [
        UpdateComponent,
        UserService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  switch (key) {
                    case 'uuid':
                      return 123;
                  }
                }
              },
            },
          },
        }
      ]
    })
    .compileComponents();

    component = TestBed.inject(UpdateComponent);
    userService = TestBed.inject(UserService);

    spyOn(userService, 'getOneById').and.returnValue(of(USER_OBJECT));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
