import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSentsComponent } from './product_sents.component';

describe('ProductSentsComponent', () => {
  let component: ProductSentsComponent;
  let fixture: ComponentFixture<ProductSentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductSentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
