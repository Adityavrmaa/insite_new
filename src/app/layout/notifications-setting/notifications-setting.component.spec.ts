import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsSettingComponent } from './notifications-setting.component';

describe('NotificationsSettingComponent', () => {
  let component: NotificationsSettingComponent;
  let fixture: ComponentFixture<NotificationsSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
