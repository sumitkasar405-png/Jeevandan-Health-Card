import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  readonly patientId = this.generatePatientId();
  photoPreview = '';
  photoError = '';
  otpMessage = '';
  otpSent = false;
  isSendingOtp = false;
  showPassword = false;
  showConfirmPassword = false;
  registrationMessage = '';
  isCreatingAccount = false;
  passwordChecks = {
    minimumLength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialCharacter: false,
  };

  private generatePatientId(): string {
    const now = new Date();
    const date = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('');
    const suffix = Math.floor(1000 + Math.random() * 9000);
    return `JVD${date}${suffix}`;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 2 * 1024 * 1024) {
      this.photoPreview = '';
      this.photoError = 'Please upload a JPG or PNG image smaller than 2MB.';
      input.value = '';
      return;
    }

    this.photoError = '';
    const reader = new FileReader();
    reader.onload = () => (this.photoPreview = String(reader.result));
    reader.readAsDataURL(file);
  }

  sendOtp(mobileNumber: string): void {
    const mobile = mobileNumber.replace(/\D/g, '');
    if (mobile.length !== 10) {
      this.otpSent = false;
      this.otpMessage = 'Enter a valid 10-digit mobile number first.';
      return;
    }

    this.isSendingOtp = true;
    this.otpMessage = 'Sending OTP...';
    window.setTimeout(() => {
      this.isSendingOtp = false;
      this.otpSent = true;
      this.otpMessage = 'OTP sent. Verify your number before creating the account.';
    }, 500);
  }

  togglePassword(field: 'password' | 'confirm-password'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
      return;
    }

    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validatePasswords(): void {
    const password = (document.getElementById('password') as HTMLInputElement | null)?.value ?? '';
    const confirmInput = document.getElementById('confirm-password') as HTMLInputElement | null;
    const confirmPassword = confirmInput?.value ?? '';
    this.passwordChecks = {
      minimumLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      specialCharacter: /[^A-Za-z0-9]/.test(password),
    };
    confirmInput?.setCustomValidity(confirmPassword && password !== confirmPassword ? 'Passwords do not match.' : '');
  }

  completeRegistration(event: SubmitEvent): void {
    event.preventDefault();
    this.isCreatingAccount = true;
    this.registrationMessage = '';
    window.setTimeout(() => {
      this.isCreatingAccount = false;
      this.registrationMessage = this.otpSent
        ? 'Your registration details are ready. Connect the registration API to create the account securely.'
        : 'Please send and verify the OTP before creating your account.';
    }, 550);
  }

  clearSubmissionMessage(): void {
    this.registrationMessage = '';
  }
}
