import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkInvolvementGalleryComponent } from './mark-involvement-gallery.component';

describe('MarkInvolvementGalleryComponent', () => {
  let component: MarkInvolvementGalleryComponent;
  let fixture: ComponentFixture<MarkInvolvementGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkInvolvementGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkInvolvementGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
