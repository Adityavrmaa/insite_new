import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatInsightComponent } from './chat-insight.component';

describe('ChatInsightComponent', () => {
  let component: ChatInsightComponent;
  let fixture: ComponentFixture<ChatInsightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatInsightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
