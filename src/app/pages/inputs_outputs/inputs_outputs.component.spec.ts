import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsOutputsComponent } from './inputs_outputs.component';

describe('InputsOutputsComponent', () => {
  let component: InputsOutputsComponent;
  let fixture: ComponentFixture<InputsOutputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputsOutputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsOutputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
