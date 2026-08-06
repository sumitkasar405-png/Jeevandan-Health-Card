import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type LoginTab = 'otp' | 'password';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements AfterViewInit, OnDestroy {
  @ViewChildren('otpBox') private otpBoxes!: QueryList<ElementRef<HTMLInputElement>>;

  activeTab: LoginTab = 'otp';

  countryCode = '+91';
  mobileNumber = '';
  otpDigits: string[] = new Array(OTP_LENGTH).fill('');
  otpSent = false;
  rememberDevice = false;

  email = '';
  password = '';

  resendSecondsLeft = 0;
  private resendTimerHandle: ReturnType<typeof setInterval> | undefined;

  toastMessage = '';
  toastIsError = false;
  private toastTimerHandle: ReturnType<typeof setTimeout> | undefined;

  ngAfterViewInit(): void {
    // Focus the first OTP box automatically once OTP has been sent.
  }

  ngOnDestroy(): void {
    clearInterval(this.resendTimerHandle);
    clearTimeout(this.toastTimerHandle);
  }

  selectTab(tab: LoginTab): void {
    this.activeTab = tab;
  }

  get mobileNumberValid(): boolean {
    return /^[6-9]\d{9}$/.test(this.mobileNumber.trim());
  }

  sendOtp(): void {
    if (!this.mobileNumberValid) {
      this.showToast('Enter a valid 10-digit mobile number', true);
      return;
    }
    this.otpSent = true;
    this.otpDigits = new Array(OTP_LENGTH).fill('');
    this.showToast('OTP sent to ' + this.countryCode + ' ' + this.mobileNumber);
    this.startResendTimer();
    setTimeout(() => this.otpBoxes?.first?.nativeElement.focus());
  }

  resendOtp(): void {
    if (this.resendSecondsLeft > 0) return;
    this.otpDigits = new Array(OTP_LENGTH).fill('');
    this.showToast('OTP resent to ' + this.countryCode + ' ' + this.mobileNumber);
    this.startResendTimer();
    setTimeout(() => this.otpBoxes?.first?.nativeElement.focus());
  }

  private startResendTimer(): void {
    clearInterval(this.resendTimerHandle);
    this.resendSecondsLeft = RESEND_SECONDS;
    this.resendTimerHandle = setInterval(() => {
      this.resendSecondsLeft -= 1;
      if (this.resendSecondsLeft <= 0) {
        clearInterval(this.resendTimerHandle);
        this.resendSecondsLeft = 0;
      }
    }, 1000);
  }

  get resendLabel(): string {
    const s = this.resendSecondsLeft;
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return mm + ':' + ss;
  }

  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '');

    if (digitsOnly.length > 1) {
      this.applyPastedOtp(index, digitsOnly);
      return;
    }

    this.otpDigits[index] = digitsOnly;
    input.value = digitsOnly;

    if (digitsOnly && index < OTP_LENGTH - 1) {
      this.focusOtpBox(index + 1);
    }
  }

  onOtpKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      this.focusOtpBox(index - 1);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focusOtpBox(index - 1);
    } else if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      this.focusOtpBox(index + 1);
    }
  }

  onOtpPaste(index: number, event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text') ?? '';
    const digitsOnly = pasted.replace(/\D/g, '');
    if (!digitsOnly) return;
    event.preventDefault();
    this.applyPastedOtp(index, digitsOnly);
  }

  private applyPastedOtp(startIndex: number, digits: string): void {
    let cursor = startIndex;
    for (const digit of digits) {
      if (cursor >= OTP_LENGTH) break;
      this.otpDigits[cursor] = digit;
      cursor += 1;
    }
    const boxesArr = this.otpBoxes?.toArray() ?? [];
    this.otpDigits.forEach((d, i) => {
      const el = boxesArr[i]?.nativeElement;
      if (el) el.value = d;
    });
    const nextEmpty = this.otpDigits.findIndex((d) => !d);
    this.focusOtpBox(nextEmpty === -1 ? OTP_LENGTH - 1 : nextEmpty);
  }

  private focusOtpBox(index: number): void {
    const box = this.otpBoxes?.toArray()[index];
    box?.nativeElement.focus();
  }

  get otpComplete(): boolean {
    return this.otpDigits.every((d) => d !== '');
  }

  verifyLogin(): void {
    if (this.activeTab === 'otp') {
      if (!this.mobileNumberValid) {
        this.showToast('Enter a valid 10-digit mobile number', true);
        return;
      }
      if (!this.otpSent) {
        this.showToast('Send the OTP first', true);
        return;
      }
      if (!this.otpComplete) {
        this.showToast('Enter the complete 6-digit OTP', true);
        return;
      }
      this.showToast('Verifying OTP…');
      // TODO: wire up to the real authentication API.
    } else {
      if (!this.email.trim() || !this.password.trim()) {
        this.showToast('Enter both email and password', true);
        return;
      }
      this.showToast('Logging in…');
      // TODO: wire up to the real authentication API.
    }
  }

  contactSupport(): void {
    this.showToast('Connecting you to support…');
  }

  private showToast(message: string, isError = false): void {
    this.toastMessage = message;
    this.toastIsError = isError;
    clearTimeout(this.toastTimerHandle);
    this.toastTimerHandle = setTimeout(() => (this.toastMessage = ''), 3200);
  }
}