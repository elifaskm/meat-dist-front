import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalsByDateComponent } from './totals-by-date.component';

describe('TotalsByDateComponent', () => {
  let component: TotalsByDateComponent;
  let fixture: ComponentFixture<TotalsByDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalsByDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalsByDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
