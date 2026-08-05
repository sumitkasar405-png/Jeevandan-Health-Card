import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginMode: 'password' | 'otp' = 'otp';
  showPassword = false;

  constructor(private readonly router: Router) {}

  selectMode(mode: 'password' | 'otp'): void {
    this.loginMode = mode;
  }

  sendOtp(): void {
    void this.router.navigateByUrl('/auth/patient/otp');
  }
}
