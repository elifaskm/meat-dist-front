import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidueOfBranchComponent } from './residue-of-branch.component';

describe('ResidueOfBranchComponent', () => {
  let component: ResidueOfBranchComponent;
  let fixture: ComponentFixture<ResidueOfBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResidueOfBranchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidueOfBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
