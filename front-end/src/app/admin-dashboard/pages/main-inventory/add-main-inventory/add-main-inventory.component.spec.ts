import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMainInventoryComponent } from './add-main-inventory.component';

describe('AddMainInventoryComponent', () => {
  let component: AddMainInventoryComponent;
  let fixture: ComponentFixture<AddMainInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMainInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMainInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
