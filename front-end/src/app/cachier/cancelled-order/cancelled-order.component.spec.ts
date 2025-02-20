import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledOrderComponent } from './cancelled-order.component';

describe('CancelledOrderComponent', () => {
  let component: CancelledOrderComponent;
  let fixture: ComponentFixture<CancelledOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelledOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelledOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
