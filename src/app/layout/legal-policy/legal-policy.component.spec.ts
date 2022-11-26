import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalPolicyComponent } from './legal-policy.component';

describe('LegalPolicyComponent', () => {
  let component: LegalPolicyComponent;
  let fixture: ComponentFixture<LegalPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
