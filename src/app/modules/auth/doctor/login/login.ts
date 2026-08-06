import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type LoginMethod = 'password' | 'otp';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

@Component({
  selector: 'app-doctor-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements AfterViewInit, OnDestroy {
  @ViewChildren('otpBox') private otpBoxes!: QueryList<ElementRef<HTMLInputElement>>;

  activeMethod: LoginMethod = 'otp';
  emailOrRegistration = '';
  password = '';
  mobileNumber = '';
  otpDigits = new Array(OTP_LENGTH).fill('');
  rememberMe = false;
  passwordVisible = false;
  languageOpen = false;
  otpSent = false;
  resendSecondsLeft = RESEND_SECONDS;
  toast = '';
  toastIsError = false;

  private resendTimer: ReturnType<typeof setInterval> | undefined;
  private toastTimer: ReturnType<typeof setTimeout> | undefined;

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    clearInterval(this.resendTimer);
    clearTimeout(this.toastTimer);
  }

  selectMethod(method: LoginMethod): void {
    this.activeMethod = method;
    if (method === 'otp') {
      setTimeout(() => this.otpBoxes?.first?.nativeElement.focus());
    }
  }

  loginWithPassword(): void {
    if (!this.emailOrRegistration.trim()) {
      this.showToast('Enter your email or registration number.', true);
      return;
    }
    if (this.password.length < 6) {
      this.showToast('Enter a password with at least 6 characters.', true);
      return;
    }
    this.showToast('Signing you in securely.');
  }

  sendOtp(): void {
    if (!/^[6-9]\d{9}$/.test(this.mobileNumber.trim())) {
      this.showToast('Enter a valid 10-digit mobile number.', true);
      return;
    }
    this.otpSent = true;
    this.otpDigits = new Array(OTP_LENGTH).fill('');
    this.startResendTimer();
    this.showToast('A 6-digit OTP has been sent to your mobile number.');
    setTimeout(() => this.otpBoxes?.first?.nativeElement.focus());
  }

  verifyOtp(): void {
    if (!this.otpSent) {
      this.showToast('Send the OTP first.', true);
      return;
    }
    if (!this.otpComplete) {
      this.showToast('Enter the complete 6-digit OTP.', true);
      return;
    }
    this.showToast('Verifying your OTP securely.');
  }

  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');
    if (digits.length > 1) {
      this.applyPastedOtp(index, digits);
      return;
    }
    this.otpDigits[index] = digits;
    input.value = digits;
    if (digits && index < OTP_LENGTH - 1) this.focusOtpBox(index + 1);
  }

  onOtpKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) this.focusOtpBox(index - 1);
    if (event.key === 'ArrowLeft' && index > 0) this.focusOtpBox(index - 1);
    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) this.focusOtpBox(index + 1);
  }

  onOtpPaste(index: number, event: ClipboardEvent): void {
    const digits = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '');
    if (!digits) return;
    event.preventDefault();
    this.applyPastedOtp(index, digits);
  }

  get otpComplete(): boolean {
    return this.otpDigits.every(Boolean);
  }

  get resendLabel(): string {
    return `00:${String(this.resendSecondsLeft).padStart(2, '0')}`;
  }

  loginWithGoogle(): void {
    this.showToast('Google sign-in will open in a secure window.');
  }

  showRegistrationMessage(): void {
    this.showToast('Doctor registration will be available shortly.');
  }

  private applyPastedOtp(startIndex: number, digits: string): void {
    let cursor = startIndex;
    for (const digit of digits) {
      if (cursor >= OTP_LENGTH) break;
      this.otpDigits[cursor++] = digit;
    }
    this.otpBoxes?.toArray().forEach((box, index) => (box.nativeElement.value = this.otpDigits[index]));
    const nextEmpty = this.otpDigits.findIndex((digit) => !digit);
    this.focusOtpBox(nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty);
  }

  private focusOtpBox(index: number): void {
    this.otpBoxes?.toArray()[index]?.nativeElement.focus();
  }

  private startResendTimer(): void {
    clearInterval(this.resendTimer);
    this.resendSecondsLeft = RESEND_SECONDS;
    this.resendTimer = setInterval(() => {
      this.resendSecondsLeft -= 1;
      if (this.resendSecondsLeft <= 0) {
        clearInterval(this.resendTimer);
        this.resendSecondsLeft = 0;
      }
    }, 1000);
  }

  private showToast(message: string, isError = false): void {
    this.toast = message;
    this.toastIsError = isError;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = ''), 3500);
  }
}
