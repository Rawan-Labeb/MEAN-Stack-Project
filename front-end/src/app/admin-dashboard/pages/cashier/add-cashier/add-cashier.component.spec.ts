import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCashierComponent } from './add-cashier.component';

describe('AddCashierComponent', () => {
  let component: AddCashierComponent;
  let fixture: ComponentFixture<AddCashierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCashierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCashierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
