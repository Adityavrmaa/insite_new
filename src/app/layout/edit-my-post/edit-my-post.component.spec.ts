import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMyPostComponent } from './edit-my-post.component';

describe('EditMyPostComponent', () => {
  let component: EditMyPostComponent;
  let fixture: ComponentFixture<EditMyPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMyPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMyPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
