import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type LoginMethod = 'password' | 'otp';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;
const MOBILE_PATTERN = /^[6-9]\d{9}$/;

@Component({
  selector: 'app-laboratory-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnDestroy {
  @ViewChildren('otpBox') private otpBoxes!: QueryList<ElementRef<HTMLInputElement>>;

  loginMethod: LoginMethod = 'otp';
  languageOpen = false;

  // Password login
  email = '';
  password = '';
  passwordVisible = false;
  rememberMe = false;

  // OTP login
  countryCode = '+91';
  mobileNumber = '';
  otpSent = false;
  otpDigits: string[] = new Array(OTP_LENGTH).fill('');
  rememberDevice = false;
  resendSecondsLeft = 0;

  message = '';
  messageIsError = false;

  private resendTimerId: ReturnType<typeof setInterval> | undefined;
  private messageTimerId: ReturnType<typeof setTimeout> | undefined;

  ngOnDestroy(): void {
    clearInterval(this.resendTimerId);
    clearTimeout(this.messageTimerId);
  }

  get maskedMobile(): string {
    if (this.mobileNumber.length !== 10) {
      return `${this.countryCode} ${this.mobileNumber}`;
    }
    return `${this.countryCode} ${this.mobileNumber.slice(0, 5)} ${this.mobileNumber.slice(5)}`;
  }

  get resendLabel(): string {
    const minutes = Math.floor(this.resendSecondsLeft / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (this.resendSecondsLeft % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  get isOtpComplete(): boolean {
    return this.otpDigits.every((digit) => digit.trim().length === 1);
  }

  selectLoginMethod(method: LoginMethod): void {
    if (this.loginMethod === method) {
      return;
    }
    this.loginMethod = method;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleLanguageMenu(): void {
    this.languageOpen = !this.languageOpen;
  }

  closeLanguageMenu(): void {
    this.languageOpen = false;
  }

  submitPasswordLogin(): void {
    if (!this.email.trim()) {
      this.showMessage('Enter your registered email or mobile number.', true);
      return;
    }
    if (this.password.trim().length < 6) {
      this.showMessage('Enter a password with at least 6 characters.', true);
      return;
    }
    this.showMessage('Your laboratory account is being verified securely.');
  }

  sendOtp(): void {
    if (!MOBILE_PATTERN.test(this.mobileNumber)) {
      this.showMessage('Enter a valid 10-digit mobile number.', true);
      return;
    }

    this.otpSent = true;
    this.otpDigits = new Array(OTP_LENGTH).fill('');
    this.startResendCountdown();
    this.showMessage(`OTP sent to ${this.maskedMobile}.`);
    this.focusOtpBox(0);
  }

  resendOtp(): void {
    if (this.resendSecondsLeft > 0) {
      return;
    }
    this.otpDigits = new Array(OTP_LENGTH).fill('');
    this.startResendCountdown();
    this.showMessage(`OTP resent to ${this.maskedMobile}.`);
    this.focusOtpBox(0);
  }

  changeNumber(): void {
    this.otpSent = false;
    this.otpDigits = new Array(OTP_LENGTH).fill('');
    this.resendSecondsLeft = 0;
    clearInterval(this.resendTimerId);
  }

  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(-1);
    this.otpDigits[index] = digit;
    input.value = digit;

    if (digit && index < OTP_LENGTH - 1) {
      this.focusOtpBox(index + 1);
    }
  }

  onOtpKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      this.focusOtpBox(index - 1);
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text').replace(/\D/g, '') ?? '';
    if (!pasted) {
      return;
    }
    event.preventDefault();
    const digits = pasted.slice(0, OTP_LENGTH).split('');
    this.otpDigits = new Array(OTP_LENGTH).fill('').map((_, i) => digits[i] ?? '');
    const nextEmptyIndex = this.otpDigits.findIndex((d) => !d);
    this.focusOtpBox(nextEmptyIndex === -1 ? OTP_LENGTH - 1 : nextEmptyIndex);
  }

  verifyAndLogin(): void {
    if (!this.otpSent) {
      this.showMessage('Send an OTP to your mobile number first.', true);
      return;
    }
    if (!this.isOtpComplete) {
      this.showMessage('Enter the complete 6-digit OTP to continue.', true);
      return;
    }
    this.showMessage('Your laboratory account is being verified securely.');
  }

  openChat(): void {
    this.showMessage('Connecting you to our support team...');
  }

  private startResendCountdown(): void {
    clearInterval(this.resendTimerId);
    this.resendSecondsLeft = RESEND_SECONDS;
    this.resendTimerId = setInterval(() => {
      this.resendSecondsLeft -= 1;
      if (this.resendSecondsLeft <= 0) {
        clearInterval(this.resendTimerId);
        this.resendSecondsLeft = 0;
      }
    }, 1000);
  }

  private focusOtpBox(index: number): void {
    setTimeout(() => {
      this.otpBoxes?.get(index)?.nativeElement.focus();
    });
  }

  private showMessage(message: string, isError = false): void {
    this.message = message;
    this.messageIsError = isError;
    clearTimeout(this.messageTimerId);
    this.messageTimerId = setTimeout(() => (this.message = ''), 3500);
  }
}