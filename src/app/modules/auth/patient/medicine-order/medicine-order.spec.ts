import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineOrder } from './medicine-order';

describe('MedicineOrder', () => {
  let component: MedicineOrder;
  let fixture: ComponentFixture<MedicineOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicineOrder],
    }).compileComponents();

    fixture = TestBed.createComponent(MedicineOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
