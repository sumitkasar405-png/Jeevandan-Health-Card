import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type LoginMethod = 'password' | 'otp';

@Component({
  selector: 'app-pharmacist-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnDestroy {
  loginMethod: LoginMethod = 'password';
  identifier = '';
  password = '';
  otp = '';
  rememberMe = false;
  passwordVisible = false;
  languageOpen = false;
  otpSent = false;
  message = '';
  messageIsError = false;

  private messageTimer: ReturnType<typeof setTimeout> | undefined;

  selectLoginMethod(method: LoginMethod): void {
    this.loginMethod = method;
    this.otpSent = false;
    this.otp = '';
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  sendOtp(): void {
    if (!this.identifier.trim()) {
      this.showMessage('Enter your registered email or mobile number first.', true);
      return;
    }

    this.otpSent = true;
    this.showMessage('A secure one-time password has been sent.');
  }

  submitLogin(): void {
    if (!this.identifier.trim()) {
      this.showMessage('Enter your registered email or mobile number.', true);
      return;
    }

    if (this.loginMethod === 'password' && this.password.trim().length < 6) {
      this.showMessage('Enter a password with at least 6 characters.', true);
      return;
    }

    if (this.loginMethod === 'otp' && this.otp.trim().length !== 6) {
      this.showMessage('Enter the 6-digit OTP to continue.', true);
      return;
    }

    this.showMessage('Your pharmacist account is being verified securely.');
  }

  loginWithGoogle(): void {
    this.showMessage('Google sign-in will open in a secure window.');
  }

  showRegistrationMessage(): void {
    this.showMessage('Use Register Now to create your pharmacist account.');
  }

  private showMessage(message: string, isError = false): void {
    this.message = message;
    this.messageIsError = isError;
    clearTimeout(this.messageTimer);
    this.messageTimer = setTimeout(() => (this.message = ''), 3500);
  }

  ngOnDestroy(): void {
    clearTimeout(this.messageTimer);
  }
}
