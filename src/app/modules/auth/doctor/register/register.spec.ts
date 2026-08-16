import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  DoctorRegisterComponent
} from './register';


describe('DoctorRegisterComponent', () => {

  let component: DoctorRegisterComponent;

  let fixture:
    ComponentFixture<DoctorRegisterComponent>;


  beforeEach(async () => {

    await TestBed.configureTestingModule({

      imports: [
        DoctorRegisterComponent
      ]

    }).compileComponents();


    fixture =
      TestBed.createComponent(
        DoctorRegisterComponent
      );


    component =
      fixture.componentInstance;


    fixture.detectChanges();

  });


  /* =========================
     COMPONENT CREATION
  ========================= */

  it('should create', () => {

    expect(component).toBeTruthy();

  });


  /* =========================
     PASSING YEARS
  ========================= */

  it('should initialize passing years', () => {

    expect(
      component.passingYears.length
    ).toBeGreaterThan(0);

  });


  /* =========================
     PASSWORD VALIDATION
  ========================= */

  it('should reject weak passwords', () => {

    component.doctor.password =
      'password';

    expect(
      component.isStrongPassword()
    ).toBe(false);

  });


  it('should accept strong passwords', () => {

    component.doctor.password =
      'Doctor@123';

    expect(
      component.isStrongPassword()
    ).toBe(true);

  });


  /* =========================
     PASSWORD MATCH
  ========================= */

  it('should detect matching passwords', () => {

    component.doctor.password =
      'Doctor@123';

    component.doctor.confirmPassword =
      'Doctor@123';

    expect(
      component.passwordsMatch()
    ).toBe(true);

  });


  it('should detect non matching passwords', () => {

    component.doctor.password =
      'Doctor@123';

    component.doctor.confirmPassword =
      'Doctor@456';

    expect(
      component.passwordsMatch()
    ).toBe(false);

  });


  /* =========================
     LANGUAGE
  ========================= */

  it('should toggle language menu', () => {

    expect(
      component.languageOpen
    ).toBe(false);

    component.toggleLanguage();

    expect(
      component.languageOpen
    ).toBe(true);

    component.toggleLanguage();

    expect(
      component.languageOpen
    ).toBe(false);

  });


  /* =========================
     PASSWORD VISIBILITY
  ========================= */

  it('should toggle password visibility', () => {

    expect(
      component.passwordVisible
    ).toBe(false);

    component.togglePasswordVisibility();

    expect(
      component.passwordVisible
    ).toBe(true);

    component.togglePasswordVisibility();

    expect(
      component.passwordVisible
    ).toBe(false);

  });


  /* =========================
     CONFIRM PASSWORD VISIBILITY
  ========================= */

  it('should toggle confirm password visibility', () => {

    expect(
      component.confirmPasswordVisible
    ).toBe(false);

    component.toggleConfirmPasswordVisibility();

    expect(
      component.confirmPasswordVisible
    ).toBe(true);

  });


  /* =========================
     RESET FORM
  ========================= */

  it('should reset the form', () => {

    component.doctor.fullName =
      'Dr. Test Doctor';

    component.doctor.email =
      'doctor@example.com';

    component.doctor.password =
      'Doctor@123';

    component.termsAccepted = true;

    component.resetForm();

    expect(
      component.doctor.fullName
    ).toBe('');

    expect(
      component.doctor.email
    ).toBe('');

    expect(
      component.doctor.password
    ).toBe('');

    expect(
      component.termsAccepted
    ).toBe(false);

  });


  /* =========================
     FILE INITIALIZATION
  ========================= */

  it('should initialize document files as null', () => {

    expect(
      component.files.profilePhoto
    ).toBeNull();

    expect(
      component.files.medicalLicense
    ).toBeNull();

    expect(
      component.files.aadhaar
    ).toBeNull();

    expect(
      component.files.qualification
    ).toBeNull();

    expect(
      component.files.experience
    ).toBeNull();

  });


  /* =========================
     FILE NAME
  ========================= */

  it('should return empty file name when no file is selected', () => {

    expect(
      component.getFileName('profilePhoto')
    ).toBe('');

  });


  /* =========================
     PASSWORD LENGTH
  ========================= */

  it('should reject password shorter than 8 characters', () => {

    component.doctor.password =
      'Ab@123';

    expect(
      component.isStrongPassword()
    ).toBe(false);

  });


  /* =========================
     PASSWORD REQUIREMENTS
  ========================= */

  it('should require uppercase letter', () => {

    component.doctor.password =
      'doctor@123';

    expect(
      component.isStrongPassword()
    ).toBe(false);

  });


  it('should require lowercase letter', () => {

    component.doctor.password =
      'DOCTOR@123';

    expect(
      component.isStrongPassword()
    ).toBe(false);

  });


  it('should require number', () => {

    component.doctor.password =
      'Doctor@abc';

    expect(
      component.isStrongPassword()
    ).toBe(false);

  });


  it('should require special character', () => {

    component.doctor.password =
      'Doctor123';

    expect(
      component.isStrongPassword()
    ).toBe(false);

  });

});