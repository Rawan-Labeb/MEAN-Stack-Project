import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdReqComponent } from './prod-req.component';

describe('ProdReqComponent', () => {
  let component: ProdReqComponent;
  let fixture: ComponentFixture<ProdReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdReqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
