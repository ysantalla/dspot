import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagmentDevicesModalComponent } from './managment-devices-modal.component';

describe('ManagmentDevicesModalComponent', () => {
  let component: ManagmentDevicesModalComponent;
  let fixture: ComponentFixture<ManagmentDevicesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagmentDevicesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagmentDevicesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
