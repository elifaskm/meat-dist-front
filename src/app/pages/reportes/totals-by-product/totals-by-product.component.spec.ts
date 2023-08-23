import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalsByProductComponent } from './totals-by-product.component';

describe('TotalsByProductComponent', () => {
  let component: TotalsByProductComponent;
  let fixture: ComponentFixture<TotalsByProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalsByProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalsByProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
