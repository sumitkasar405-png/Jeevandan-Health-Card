


import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnDestroy {

  // =========================================================
  // PASSWORD LOGIN
  // =========================================================

  email = '';
  password = '';
  rememberMe = false;

  loginMode: 'password' | 'otp' = 'password';

  showPassword = false;


  // =========================================================
  // OTP LOGIN
  // =========================================================

  mobileNumber = '';

  countryCode = '+91';

  otpSent = false;

  otpDigits: string[] = ['', '', '', '', '', ''];

  rememberDevice = false;

  resendSeconds = 45;

  private resendTimer: ReturnType<typeof setInterval> | null = null;


  @ViewChildren('otpInput')
  otpInputs!: QueryList<ElementRef<HTMLInputElement>>;


  // =========================================================
  // TAB SWITCHING
  // =========================================================

  selectPasswordLogin(): void {

    this.loginMode = 'password';

    this.resetOtp();

  }


  selectOtpLogin(): void {

    this.loginMode = 'otp';

    this.resetOtp();

  }


  // =========================================================
  // PASSWORD
  // =========================================================

  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }


  forgotPassword(): void {

    console.log('Forgot Password');

  }


  // =========================================================
  // MAIN LOGIN
  // =========================================================

  login(): void {

    if (this.loginMode === 'otp') {

      this.verifyOtp();

      return;

    }


    console.log('Hospital Login');

    console.log({

      email: this.email,

      password: this.password,

      rememberMe: this.rememberMe,

      mode: this.loginMode

    });

    // TODO:
    // Connect your password authentication API here.

  }


  // =========================================================
  // SEND OTP
  // =========================================================

  sendOtp(): void {

    const mobile = this.mobileNumber.trim();


    // Check mobile number
    if (!/^\d{10}$/.test(mobile)) {

      console.log('Please enter a valid 10-digit mobile number.');

      return;

    }


    // Clear old OTP
    this.otpDigits = ['', '', '', '', '', ''];


    console.log('Sending OTP to:', this.countryCode + mobile);


    /*
     * TODO:
     *
     * Replace this section with your backend API.
     *
     * Example:
     *
     * this.authService.sendOtp(
     *   this.countryCode + mobile
     * ).subscribe({
     *
     *   next: () => {
     *     this.otpSent = true;
     *     this.startResendTimer();
     *   },
     *
     *   error: (error) => {
     *     console.error(error);
     *   }
     *
     * });
     */


    // For frontend testing:
    this.otpSent = true;

    this.startResendTimer();

  }


  // =========================================================
  // MASK MOBILE NUMBER
  // =========================================================

  get maskedMobileNumber(): string {

    if (this.mobileNumber.length !== 10) {

      return this.countryCode + ' ' + this.mobileNumber;

    }


    return (
      this.countryCode +
      ' ' +
      '******' +
      this.mobileNumber.slice(-4)
    );

  }


  // =========================================================
  // OTP INPUT
  // =========================================================

  onOtpInput(
    event: Event,
    index: number
  ): void {

    const input =
      event.target as HTMLInputElement;


    // Only numbers
    input.value =
      input.value.replace(/\D/g, '').slice(0, 1);


    this.otpDigits[index] = input.value;


    // Move to next box
    if (
      input.value &&
      index < 5
    ) {

      const nextInput =
        this.otpInputs.get(index + 1);

      nextInput?.nativeElement.focus();

    }

  }


  // =========================================================
  // OTP BACKSPACE
  // =========================================================

  onOtpKeyDown(
    event: KeyboardEvent,
    index: number
  ): void {

    if (
      event.key === 'Backspace' &&
      !this.otpDigits[index] &&
      index > 0
    ) {

      const previousInput =
        this.otpInputs.get(index - 1);

      previousInput?.nativeElement.focus();

    }

  }


  // =========================================================
  // VERIFY OTP
  // =========================================================

  verifyOtp(): void {

    const enteredOtp =
      this.otpDigits.join('');


    if (!/^\d{6}$/.test(enteredOtp)) {

      console.log('Please enter the complete 6-digit OTP.');

      return;

    }


    console.log('Verifying OTP:', {

      mobile:
        this.countryCode +
        this.mobileNumber,

      otp: enteredOtp,

      rememberDevice:
        this.rememberDevice

    });


    /*
     * TODO:
     *
     * Connect your real OTP verification API here.
     *
     * Example:
     *
     * this.authService.verifyOtp(
     *   this.countryCode + this.mobileNumber,
     *   enteredOtp
     * ).subscribe({
     *
     *   next: (response) => {
     *     // Save token
     *     // Navigate to dashboard
     *   },
     *
     *   error: (error) => {
     *     console.error('Invalid OTP', error);
     *   }
     *
     * });
     */

  }


  // =========================================================
  // RESEND OTP
  // =========================================================

  resendOtp(): void {

    if (this.resendSeconds > 0) {

      return;

    }


    this.otpDigits =
      ['', '', '', '', '', ''];


    console.log(
      'Resending OTP to:',
      this.countryCode + this.mobileNumber
    );


    /*
     * TODO:
     *
     * Replace with your real resend OTP API.
     */


    this.startResendTimer();

  }


  // =========================================================
  // START TIMER
  // =========================================================

  private startResendTimer(): void {

    this.stopResendTimer();


    this.resendSeconds = 45;


    this.resendTimer =
      setInterval(() => {

        if (this.resendSeconds > 0) {

          this.resendSeconds--;

        } else {

          this.stopResendTimer();

        }

      }, 1000);

  }


  // =========================================================
  // STOP TIMER
  // =========================================================

  private stopResendTimer(): void {

    if (this.resendTimer !== null) {

      clearInterval(this.resendTimer);

      this.resendTimer = null;

    }

  }


  // =========================================================
  // CHANGE MOBILE NUMBER
  // =========================================================

  changeOtpNumber(): void {

    this.resetOtp();

  }


  // =========================================================
  // RESET OTP
  // =========================================================

  private resetOtp(): void {

    this.otpSent = false;

    this.otpDigits =
      ['', '', '', '', '', ''];

    this.resendSeconds = 45;

    this.stopResendTimer();

  }


  // =========================================================
  // GOOGLE
  // =========================================================

  loginWithGoogle(): void {

    console.log('Google Login');

  }


  // =========================================================
  // REGISTER
  // =========================================================

  registerHospital(): void {

    console.log('Register Hospital');

  }


  // =========================================================
  // CLEANUP
  // =========================================================

  ngOnDestroy(): void {

    this.stopResendTimer();

  }

}