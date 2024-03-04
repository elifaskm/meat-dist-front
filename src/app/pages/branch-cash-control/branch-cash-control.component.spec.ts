import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsOutputsComponent } from './branch-cash-control.component';

describe('BranchCashControlComponent', () => {
  let component: BranchCashControlComponent;
  let fixture: ComponentFixture<BranchCashControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchCashControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchCashControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
