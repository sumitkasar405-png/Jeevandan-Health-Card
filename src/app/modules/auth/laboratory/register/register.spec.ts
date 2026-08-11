import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { RegisterComponent } from './register';

describe('RegisterComponent (Laboratory)', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with no section complete', () => {
    expect(component.labComplete).toBeFalsy();
    expect(component.adminComplete).toBeFalsy();
    expect(component.addressComplete).toBeFalsy();
    expect(component.documentsComplete).toBeFalsy();
    expect(component.allComplete).toBeFalsy();
  });

  it('should mark laboratory information complete once required fields are filled', () => {
    component.lab.name = 'City Care Diagnostics';
    component.lab.type = 'Pathology Laboratory';
    component.lab.regNumber = 'LAB/2025/0512';
    component.lab.email = 'info@citycarelab.com';
    component.lab.phone = '9876543210';
    component.lab.establishedYear = '2022';
    expect(component.labComplete).toBe(true);
  });

  it('should require matching passwords for admin information to be complete', () => {
    component.admin.fullName = 'Dr. Rahul Sharma';
    component.admin.email = 'rahul.sharma@citycarelab.com';
    component.admin.phone = '9876543210';
    component.admin.designation = 'Laboratory Administrator';
    component.admin.password = 'secret123';
    component.admin.confirmPassword = 'different';
    expect(component.adminComplete).toBe(false);

    component.admin.confirmPassword = 'secret123';
    expect(component.adminComplete).toBe(true);
  });

  it('should mark address complete once required fields are filled', () => {
    component.address.line1 = '123, Health Care Street';
    component.address.city = 'Pune';
    component.address.state = 'Maharashtra';
    component.address.pincode = '411001';
    component.address.country = 'India';
    expect(component.addressComplete).toBe(true);
  });

  it('should block submission when required documents are missing', () => {
    component.submitRegistration();
    expect(component.messageIsError).toBe(true);
  });

  it('should compute the step list with completion flags', () => {
    expect(component.steps.length).toBe(5);
    expect(component.steps[0].title).toBe('Lab Information');
  });
});