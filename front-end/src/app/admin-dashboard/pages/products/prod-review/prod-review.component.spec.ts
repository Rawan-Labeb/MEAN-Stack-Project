import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdReviewComponent } from './prod-review.component';

describe('ProdReviewComponent', () => {
  let component: ProdReviewComponent;
  let fixture: ComponentFixture<ProdReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
