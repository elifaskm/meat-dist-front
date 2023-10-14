import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestartDbComponent } from './restart-db.component';

describe('RestartDbComponent', () => {
  let component: RestartDbComponent;
  let fixture: ComponentFixture<RestartDbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestartDbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestartDbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
