import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LoginComponent } from './login';

describe('LoginComponent (Laboratory)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to the OTP login tab', () => {
    expect(component.loginMethod).toBe('otp');
  });

  it('should switch to the password tab', () => {
    component.selectLoginMethod('password');
    expect(component.loginMethod).toBe('password');
  });

  it('should reject an invalid mobile number when sending OTP', () => {
    component.mobileNumber = '12345';
    component.sendOtp();
    expect(component.otpSent).toBeFalsy();
    expect(component.messageIsError).toBe(true);
  });

  it('should send OTP and start the resend countdown for a valid mobile number', () => {
    component.mobileNumber = '9876543210';
    component.sendOtp();
    expect(component.otpSent).toBe(true);
    expect(component.resendSecondsLeft).toBe(45);
  });

  it('should mask the mobile number for display', () => {
    component.mobileNumber = '9876543210';
    expect(component.maskedMobile).toBe('+91 98765 43210');
  });

  it('should require a complete OTP before verifying', () => {
    component.mobileNumber = '9876543210';
    component.sendOtp();
    component.verifyAndLogin();
    expect(component.messageIsError).toBe(true);
  });

  it('should consider the OTP complete once all six digits are filled', () => {
    component.otpDigits = ['1', '2', '3', '4', '5', '6'];
    expect(component.isOtpComplete).toBe(true);
  });

  it('should reset OTP state when changing the mobile number', () => {
    component.mobileNumber = '9876543210';
    component.sendOtp();
    component.changeNumber();
    expect(component.otpSent).toBe(false);
    expect(component.resendSecondsLeft).toBe(0);
  });
});