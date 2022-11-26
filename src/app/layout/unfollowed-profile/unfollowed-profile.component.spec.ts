import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfollowedProfileComponent } from './unfollowed-profile.component';

describe('UnfollowedProfileComponent', () => {
  let component: UnfollowedProfileComponent;
  let fixture: ComponentFixture<UnfollowedProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnfollowedProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfollowedProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
