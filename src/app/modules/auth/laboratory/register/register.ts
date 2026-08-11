import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface LabInfo {
  name: string;
  type: string;
  regNumber: string;
  email: string;
  phoneCode: string;
  phone: string;
  altCode: string;
  altPhone: string;
  establishedYear: string;
  gst: string;
  website: string;
}

interface AdminInfo {
  fullName: string;
  email: string;
  phoneCode: string;
  phone: string;
  designation: string;
  password: string;
  confirmPassword: string;
}

interface AddressInfo {
  line1: string;
  line2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude: string;
  longitude: string;
}

interface DocumentSlot {
  id: string;
  label: string;
  icon: string;
  colorClass: string;
  required: boolean;
  fileName: string;
  fileSize: string;
}

interface StepInfo {
  index: number;
  title: string;
  subtitle: string;
  icon: string;
  complete: boolean;
}

@Component({
  selector: 'app-laboratory-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  @ViewChildren('fileInput') private fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  languageOpen = false;
  passwordVisible = false;
  confirmPasswordVisible = false;

  message = '';
  messageIsError = false;
  private messageTimerId: ReturnType<typeof setTimeout> | undefined;

  lab: LabInfo = {
    name: '',
    type: '',
    regNumber: '',
    email: '',
    phoneCode: '+91',
    phone: '',
    altCode: '+91',
    altPhone: '',
    establishedYear: '',
    gst: '',
    website: '',
  };

  admin: AdminInfo = {
    fullName: '',
    email: '',
    phoneCode: '+91',
    phone: '',
    designation: '',
    password: '',
    confirmPassword: '',
  };

  address: AddressInfo = {
    line1: '',
    line2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    latitude: '',
    longitude: '',
  };

  documents: DocumentSlot[] = [
    { id: 'registration', label: 'Registration Certificate', icon: 'fa-file-lines', colorClass: 'doc-red', required: true, fileName: '', fileSize: '' },
    { id: 'gst', label: 'GST Certificate', icon: 'fa-file-invoice', colorClass: 'doc-blue', required: false, fileName: '', fileSize: '' },
    { id: 'address', label: 'Address Proof', icon: 'fa-file-lines', colorClass: 'doc-purple', required: true, fileName: '', fileSize: '' },
    { id: 'license', label: 'Lab License / Accreditation', icon: 'fa-file-shield', colorClass: 'doc-purple', required: true, fileName: '', fileSize: '' },
    { id: 'adminId', label: 'Admin ID Proof', icon: 'fa-file-lines', colorClass: 'doc-orange', required: true, fileName: '', fileSize: '' },
  ];

  toggleLanguageMenu(): void {
    this.languageOpen = !this.languageOpen;
  }

  closeLanguageMenu(): void {
    this.languageOpen = false;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  get labComplete(): boolean {
    const l = this.lab;
    return !!(l.name.trim() && l.type.trim() && l.regNumber.trim() && l.email.trim() && l.phone.trim() && l.establishedYear.trim());
  }

  get adminComplete(): boolean {
    const a = this.admin;
    return !!(
      a.fullName.trim() &&
      a.email.trim() &&
      a.phone.trim() &&
      a.designation.trim() &&
      a.password.length >= 6 &&
      a.confirmPassword.length >= 6 &&
      a.password === a.confirmPassword
    );
  }

  get addressComplete(): boolean {
    const ad = this.address;
    return !!(ad.line1.trim() && ad.city.trim() && ad.state.trim() && ad.pincode.trim() && ad.country.trim());
  }

  get documentsComplete(): boolean {
    return this.documents.filter((d) => d.required).every((d) => !!d.fileName);
  }

  get allComplete(): boolean {
    return this.labComplete && this.adminComplete && this.addressComplete && this.documentsComplete;
  }

  get steps(): StepInfo[] {
    return [
      { index: 1, title: 'Lab Information', subtitle: 'Basic details', icon: 'fa-flask', complete: this.labComplete },
      { index: 2, title: 'Admin Information', subtitle: 'Administrator details', icon: 'fa-user', complete: this.adminComplete },
      { index: 3, title: 'Address & Location', subtitle: 'Laboratory location', icon: 'fa-location-dot', complete: this.addressComplete },
      { index: 4, title: 'Documents', subtitle: 'Upload documents', icon: 'fa-file-lines', complete: this.documentsComplete },
      { index: 5, title: 'Review & Submit', subtitle: 'Verify & submit', icon: 'fa-circle-check', complete: this.allComplete },
    ];
  }

  triggerFileInput(index: number): void {
    this.fileInputs?.get(index)?.nativeElement.click();
  }

  onDocumentSelected(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.documents[index] = {
      ...this.documents[index],
      fileName: file.name,
      fileSize: this.formatFileSize(file.size),
    };
  }

  goToSection(sectionId: string): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  submitRegistration(): void {
    if (!this.labComplete) {
      this.showMessage('Please complete the Laboratory Information section.', true);
      this.goToSection('lab-information');
      return;
    }
    if (!this.adminComplete) {
      this.showMessage('Please complete the Admin Information section correctly.', true);
      this.goToSection('admin-information');
      return;
    }
    if (!this.addressComplete) {
      this.showMessage('Please complete the Address & Location section.', true);
      this.goToSection('address-location');
      return;
    }
    if (!this.documentsComplete) {
      this.showMessage('Please upload all required documents.', true);
      this.goToSection('documents-uploaded');
      return;
    }
    this.showMessage('Your laboratory registration has been submitted for review.');
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    const kb = bytes / 1024;
    if (kb < 1024) {
      return `${Math.round(kb)} KB`;
    }
    return `${(kb / 1024).toFixed(1)} MB`;
  }

  private showMessage(message: string, isError = false): void {
    this.message = message;
    this.messageIsError = isError;
    clearTimeout(this.messageTimerId);
    this.messageTimerId = setTimeout(() => (this.message = ''), 3500);
  }
}