import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMainInventoryComponent } from './edit-main-inventory.component';

describe('EditMainInventoryComponent', () => {
  let component: EditMainInventoryComponent;
  let fixture: ComponentFixture<EditMainInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMainInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMainInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
