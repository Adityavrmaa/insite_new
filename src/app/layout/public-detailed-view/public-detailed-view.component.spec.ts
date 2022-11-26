import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicDetailedViewComponent } from './public-detailed-view.component';

describe('PublicDetailedViewComponent', () => {
  let component: PublicDetailedViewComponent;
  let fixture: ComponentFixture<PublicDetailedViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicDetailedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicDetailedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
