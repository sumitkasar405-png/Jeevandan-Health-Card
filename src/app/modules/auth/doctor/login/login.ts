import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, QueryList, ViewChildren } from '@angular/core';
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
export class Login implements OnDestroy {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  loginMethod: LoginMethod = 'password';

  identifier = '';
  password = '';
  rememberMe = false;
  passwordVisible = false;

  mobile = '';
  otpDigits: string[] = Array(OTP_LENGTH).fill('');
  otpSent = false;
  resendCooldown = 0;

  languageOpen = false;
  message = '';
  messageIsError = false;

  private messageTimer: ReturnType<typeof setTimeout> | undefined;
  private cooldownTimer: ReturnType<typeof setInterval> | undefined;

  get formattedCooldown(): string {
    const minutes = Math.floor(this.resendCooldown / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (this.resendCooldown % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  selectLoginMethod(method: LoginMethod): void {
    this.loginMethod = method;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  submitPasswordLogin(): void {
    if (!this.identifier.trim()) {
      this.showMessage('Enter your email or registration number.', true);
      return;
    }

    if (this.password.trim().length < 6) {
      this.showMessage('Enter a password with at least 6 characters.', true);
      return;
    }

    this.showMessage('Your doctor account is being verified securely.');
  }

  sendOtp(): void {
    if (!this.mobile.trim() || this.mobile.trim().length !== 10) {
      this.showMessage('Enter a valid 10-digit mobile number.', true);
      return;
    }

    this.otpSent = true;
    this.otpDigits = Array(OTP_LENGTH).fill('');
    this.startCooldown();
    this.showMessage('A 6-digit OTP has been sent to your mobile number.');

    setTimeout(() => this.otpInputs?.first?.nativeElement.focus());
  }

  resendOtp(): void {
    if (this.resendCooldown > 0) {
      return;
    }

    this.sendOtp();
  }

  onOtpInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '').slice(-1);
    this.otpDigits[index] = value;

    if (value && index < OTP_LENGTH - 1) {
      this.focusOtpInput(index + 1);
    }
  }

  onOtpKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      this.focusOtpInput(index - 1);
    }
  }

  submitOtpLogin(): void {
    if (!this.otpSent) {
      this.showMessage('Send an OTP to your mobile number first.', true);
      return;
    }

    if (this.otpDigits.join('').length !== OTP_LENGTH) {
      this.showMessage('Enter the complete 6-digit OTP to continue.', true);
      return;
    }

    this.showMessage('Your doctor account is being verified securely.');
  }

  loginWithGoogle(): void {
    this.showMessage('Google sign-in will open in a secure window.');
  }

  showRegistrationMessage(): void {
    this.showMessage('Use Register as Doctor to create your account.');
  }

  private focusOtpInput(index: number): void {
    const target = this.otpInputs?.toArray()[index];
    target?.nativeElement.focus();
  }

  private startCooldown(): void {
    this.resendCooldown = RESEND_SECONDS;
    clearInterval(this.cooldownTimer);
    this.cooldownTimer = setInterval(() => {
      this.resendCooldown -= 1;
      if (this.resendCooldown <= 0) {
        clearInterval(this.cooldownTimer);
      }
    }, 1000);
  }

  private showMessage(message: string, isError = false): void {
    this.message = message;
    this.messageIsError = isError;
    clearTimeout(this.messageTimer);
    this.messageTimer = setTimeout(() => (this.message = ''), 3500);
  }

  ngOnDestroy(): void {
    clearTimeout(this.messageTimer);
    clearInterval(this.cooldownTimer);
  }
}
