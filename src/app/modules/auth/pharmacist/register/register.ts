import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type DocumentKey = 'registrationCertificate' | 'qualificationCertificate' | 'identityProof' | 'passportPhoto';

interface RegistrationDocument {
  key: DocumentKey;
  title: string;
  detail: string;
  icon: string;
}

@Component({
  selector: 'app-pharmacist-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  form = this.createEmptyForm();
  passwordVisible = false;
  confirmPasswordVisible = false;
  shopImageName = '';
  documentNames: Partial<Record<DocumentKey, string>> = {};
  toast = '';
  toastIsError = false;

  readonly steps = [
    { id: 'personal', label: 'Personal Info', icon: 'fa-regular fa-user' },
    { id: 'professional', label: 'Professional Info', icon: 'fa-solid fa-building-columns' },
    { id: 'shop', label: 'Medical Shop Info', icon: 'fa-solid fa-shop' },
    { id: 'security', label: 'Account & Security', icon: 'fa-solid fa-shield-halved' },
    { id: 'review', label: 'Review & Submit', icon: 'fa-regular fa-clipboard' },
  ];

  readonly documents: RegistrationDocument[] = [
    { key: 'registrationCertificate', title: 'Pharmacy Registration Certificate', detail: 'PDF, JPG, PNG (Max 2MB)', icon: 'fa-regular fa-file-lines' },
    { key: 'qualificationCertificate', title: 'Qualification Certificate', detail: 'PDF, JPG, PNG (Max 2MB)', icon: 'fa-regular fa-file-lines' },
    { key: 'identityProof', title: 'ID Proof (Aadhaar/PAN/Voter ID)', detail: 'PDF, JPG, PNG (Max 2MB)', icon: 'fa-regular fa-id-card' },
    { key: 'passportPhoto', title: 'Passport Size Photo', detail: 'JPG, PNG (Max 2MB)', icon: 'fa-regular fa-user' },
  ];

  get passwordChecks(): boolean[] {
    const password = this.form.password;
    return [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
  }

  get passwordStrength(): string {
    const score = this.passwordChecks.filter(Boolean).length;
    return score < 3 ? 'Weak' : score < 5 ? 'Medium' : 'Strong';
  }

  get isPasswordValid(): boolean {
    return this.passwordChecks.every(Boolean);
  }

  scrollTo(sectionId: string): void {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onShopImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      this.showToast('Shop image must be smaller than 2MB.', true);
      return;
    }
    this.shopImageName = file.name;
  }

  onDocumentSelected(event: Event, key: DocumentKey): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      this.showToast('Each document must be smaller than 2MB.', true);
      return;
    }
    this.documentNames[key] = file.name;
  }

  resetForm(): void {
    this.form = this.createEmptyForm();
    this.shopImageName = '';
    this.documentNames = {};
    this.showToast('The registration form has been reset.');
  }

  cancelRegistration(): void {
    this.showToast('Your details are kept on this device until you reset the form.');
  }

  submitForReview(): void {
    const requiredDocumentsAdded = this.documents.every((document) => !!this.documentNames[document.key]);
    if (!this.form.fullName || !this.form.mobile || !this.form.email || !this.form.registrationNumber || !this.form.shopName) {
      this.showToast('Complete the required personal, professional, and shop details first.', true);
      return;
    }
    if (!this.isPasswordValid || this.form.password !== this.form.confirmPassword) {
      this.showToast('Create a matching password that satisfies every security requirement.', true);
      return;
    }
    if (!requiredDocumentsAdded || !this.form.acceptTerms) {
      this.showToast('Upload all required documents and accept the terms to continue.', true);
      return;
    }
    this.showToast('Your pharmacist registration is ready for review.');
  }

  private createEmptyForm() {
    return {
      fullName: '', dateOfBirth: '', gender: '', mobile: '', email: '', alternateNumber: '',
      registrationNumber: '', pharmacyCouncil: '', registrationExpiry: '', qualification: '', passingYear: '', organization: '',
      addressLine1: '', addressLine2: '', locality: '', city: '', state: '', district: '', pincode: '',
      shopName: '', shopLicense: '', shopType: '', establishmentYear: '', shopAddress: '', shopCity: '', shopPincode: '', shopPhone: '', gstNumber: '', timings: '',
      password: '', confirmPassword: '', acceptTerms: false,
    };
  }

  private showToast(message: string, isError = false): void {
    this.toast = message;
    this.toastIsError = isError;
    setTimeout(() => {
      if (this.toast === message) this.toast = '';
    }, 3500);
  }
}
