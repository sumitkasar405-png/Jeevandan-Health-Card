import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface DoctorRegistration {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  maritalStatus: string;
  nationality: string;

  registrationNumber: string;
  specialization: string;
  experience: number | null;
  qualification: string;
  college: string;
  passingYear: string;
  consultationType: string;
  consultationFee: number | null;
  workingAt: string;

  mobile: string;
  email: string;
  alternateMobile: string;

  address1: string;
  address2: string;
  city: string;
  state: string;
  district: string;
  pincode: string;

  password: string;
  confirmPassword: string;
}

interface DoctorFiles {
  profilePhoto: File | null;
  medicalLicense: File | null;
  aadhaar: File | null;
  qualification: File | null;
  experience: File | null;
}

type DocumentKey = keyof DoctorFiles;

@Component({
  selector: 'app-doctor-register',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class DoctorRegisterComponent {

  @ViewChildren('fileInput')
  fileInputs!: QueryList<ElementRef<HTMLInputElement>>;

  /* =========================
     LANGUAGE
  ========================= */

  languageOpen = false;

  /* =========================
     FORM DATA
  ========================= */

  doctor: DoctorRegistration = {
    fullName: '',
    gender: '',
    dateOfBirth: '',
    bloodGroup: '',
    maritalStatus: '',
    nationality: '',

    registrationNumber: '',
    specialization: '',
    experience: null,
    qualification: '',
    college: '',
    passingYear: '',
    consultationType: '',
    consultationFee: null,
    workingAt: '',

    mobile: '',
    email: '',
    alternateMobile: '',

    address1: '',
    address2: '',
    city: '',
    state: '',
    district: '',
    pincode: '',

    password: '',
    confirmPassword: ''
  };

  /* =========================
     FILES
  ========================= */

  files: DoctorFiles = {
    profilePhoto: null,
    medicalLicense: null,
    aadhaar: null,
    qualification: null,
    experience: null
  };

  /* =========================
     OPTIONS
  ========================= */

  genders = [
    'Male',
    'Female',
    'Other'
  ];

  bloodGroups = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-'
  ];

  maritalStatuses = [
    'Single',
    'Married',
    'Other'
  ];

  nationalities = [
    'Indian',
    'Other'
  ];

  specializations = [
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'ENT Specialist',
    'Gynecologist',
    'Neurologist',
    'Orthopedic',
    'Pediatrician',
    'Psychiatrist',
    'Radiologist',
    'Dentist',
    'Other'
  ];

  consultationTypes = [
    'In-Clinic',
    'Online',
    'Both'
  ];

  states = [
    'Maharashtra',
    'Gujarat',
    'Madhya Pradesh',
    'Karnataka',
    'Goa',
    'Delhi',
    'Rajasthan',
    'Tamil Nadu',
    'Telangana',
    'Other'
  ];

  districts = [
    'Ahmednagar',
    'Pune',
    'Nashik',
    'Mumbai',
    'Thane',
    'Nagpur',
    'Aurangabad',
    'Kolhapur',
    'Satara',
    'Other'
  ];

  passingYears: string[] = [];

  /* =========================
     PASSWORD
  ========================= */

  passwordVisible = false;
  confirmPasswordVisible = false;

  termsAccepted = false;

  /* =========================
     MESSAGE
  ========================= */

  message = '';
  messageType: 'success' | 'error' = 'success';

  /* =========================
     DOCUMENT INFORMATION
  ========================= */

  documentLabels: Record<DocumentKey, string> = {
    profilePhoto: 'Profile Photo',
    medicalLicense: 'Medical License',
    aadhaar: 'Aadhaar Card',
    qualification: 'Qualification Certificate',
    experience: 'Experience Certificate'
  };

  documentAccept: Record<DocumentKey, string> = {
    profilePhoto: '.jpg,.jpeg,.png',
    medicalLicense: '.pdf,.jpg,.jpeg',
    aadhaar: '.pdf,.jpg,.jpeg',
    qualification: '.pdf,.jpg,.jpeg',
    experience: '.pdf,.jpg,.jpeg'
  };

  /* =========================
     CONSTRUCTOR
  ========================= */

  constructor() {
    this.generatePassingYears();
  }

  /* =========================
     YEARS
  ========================= */

  generatePassingYears(): void {
    const currentYear = new Date().getFullYear();

    this.passingYears = [];

    for (let year = currentYear; year >= 1950; year--) {
      this.passingYears.push(String(year));
    }
  }

  /* =========================
     LANGUAGE
  ========================= */

  toggleLanguage(): void {
    this.languageOpen = !this.languageOpen;
  }

  selectLanguage(language: string): void {
    this.languageOpen = false;

    this.showMessage(
      `${language} language selected.`,
      'success'
    );
  }

  /* =========================
     PASSWORD VISIBILITY
  ========================= */

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible =
      !this.confirmPasswordVisible;
  }

  /* =========================
     PASSWORD VALIDATION
  ========================= */

  isStrongPassword(): boolean {

    const password = this.doctor.password;

    if (!password) {
      return false;
    }

    const minimumLength =
      password.length >= 8;

    const uppercase =
      /[A-Z]/.test(password);

    const lowercase =
      /[a-z]/.test(password);

    const number =
      /[0-9]/.test(password);

    const specialCharacter =
      /[^A-Za-z0-9]/.test(password);

    return (
      minimumLength &&
      uppercase &&
      lowercase &&
      number &&
      specialCharacter
    );
  }

  passwordsMatch(): boolean {
    return (
      this.doctor.password ===
      this.doctor.confirmPassword
    );
  }

  /* =========================
     FILE UPLOAD
  ========================= */

  triggerFileUpload(
    documentType: DocumentKey
  ): void {

    const input =
      document.getElementById(
        `file-${documentType}`
      ) as HTMLInputElement | null;

    if (input) {
      input.click();
    }
  }

  onFileSelected(
    event: Event,
    documentType: DocumentKey
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {
      return;
    }

    const file = input.files[0];

    /* Maximum file size = 2 MB */

    const maxSize =
      2 * 1024 * 1024;

    if (file.size > maxSize) {

      this.showMessage(
        `${this.documentLabels[documentType]} must be less than 2 MB.`,
        'error'
      );

      input.value = '';
      return;
    }

    /* File type validation */

    const allowedTypes: Record<
      DocumentKey,
      string[]
    > = {

      profilePhoto: [
        'image/jpeg',
        'image/png'
      ],

      medicalLicense: [
        'application/pdf',
        'image/jpeg',
        'image/png'
      ],

      aadhaar: [
        'application/pdf',
        'image/jpeg',
        'image/png'
      ],

      qualification: [
        'application/pdf',
        'image/jpeg',
        'image/png'
      ],

      experience: [
        'application/pdf',
        'image/jpeg',
        'image/png'
      ]
    };

    if (
      !allowedTypes[documentType]
        .includes(file.type)
    ) {

      this.showMessage(
        `Invalid file type for ${this.documentLabels[documentType]}.`,
        'error'
      );

      input.value = '';
      return;
    }

    this.files[documentType] = file;

    this.showMessage(
      `${this.documentLabels[documentType]} uploaded successfully.`,
      'success'
    );
  }

  getFileName(
    documentType: DocumentKey
  ): string {

    const file =
      this.files[documentType];

    return file
      ? file.name
      : '';
  }

  removeFile(
    documentType: DocumentKey
  ): void {

    this.files[documentType] = null;

    const input =
      document.getElementById(
        `file-${documentType}`
      ) as HTMLInputElement | null;

    if (input) {
      input.value = '';
    }
  }

  /* =========================
     FORM VALIDATION
  ========================= */

  validateForm(): boolean {

    if (!this.doctor.fullName.trim()) {

      this.showMessage(
        'Please enter your full name.',
        'error'
      );

      return false;
    }

    if (!this.doctor.gender) {

      this.showMessage(
        'Please select your gender.',
        'error'
      );

      return false;
    }

    if (!this.doctor.dateOfBirth) {

      this.showMessage(
        'Please select your date of birth.',
        'error'
      );

      return false;
    }

    if (!this.doctor.nationality) {

      this.showMessage(
        'Please select your nationality.',
        'error'
      );

      return false;
    }

    if (
      !this.doctor.registrationNumber.trim()
    ) {

      this.showMessage(
        'Please enter your medical registration number.',
        'error'
      );

      return false;
    }

    if (!this.doctor.specialization) {

      this.showMessage(
        'Please select your specialization.',
        'error'
      );

      return false;
    }

    if (
      this.doctor.experience === null ||
      this.doctor.experience < 0
    ) {

      this.showMessage(
        'Please enter valid experience.',
        'error'
      );

      return false;
    }

    if (
      !this.doctor.qualification.trim()
    ) {

      this.showMessage(
        'Please enter your qualification.',
        'error'
      );

      return false;
    }

    if (!this.doctor.college.trim()) {

      this.showMessage(
        'Please enter your college or university.',
        'error'
      );

      return false;
    }

    if (!this.doctor.passingYear) {

      this.showMessage(
        'Please select your passing year.',
        'error'
      );

      return false;
    }

    if (!this.doctor.consultationType) {

      this.showMessage(
        'Please select consultation type.',
        'error'
      );

      return false;
    }

    if (
      this.doctor.consultationFee === null ||
      this.doctor.consultationFee < 0
    ) {

      this.showMessage(
        'Please enter a valid consultation fee.',
        'error'
      );

      return false;
    }

    if (!this.doctor.workingAt) {

      this.showMessage(
        'Please select hospital or clinic.',
        'error'
      );

      return false;
    }

    if (!this.doctor.mobile.trim()) {

      this.showMessage(
        'Please enter your mobile number.',
        'error'
      );

      return false;
    }

    if (
      !/^[6-9]\d{9}$/.test(
        this.doctor.mobile
      )
    ) {

      this.showMessage(
        'Please enter a valid 10-digit mobile number.',
        'error'
      );

      return false;
    }

    if (!this.doctor.email.trim()) {

      this.showMessage(
        'Please enter your email address.',
        'error'
      );

      return false;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(this.doctor.email)
    ) {

      this.showMessage(
        'Please enter a valid email address.',
        'error'
      );

      return false;
    }

    if (!this.doctor.address1.trim()) {

      this.showMessage(
        'Please enter address line 1.',
        'error'
      );

      return false;
    }

    if (!this.doctor.city.trim()) {

      this.showMessage(
        'Please enter your city.',
        'error'
      );

      return false;
    }

    if (!this.doctor.state) {

      this.showMessage(
        'Please select your state.',
        'error'
      );

      return false;
    }

    if (!this.doctor.district) {

      this.showMessage(
        'Please select your district.',
        'error'
      );

      return false;
    }

    if (
      !/^\d{6}$/.test(
        this.doctor.pincode
      )
    ) {

      this.showMessage(
        'Please enter a valid 6-digit pincode.',
        'error'
      );

      return false;
    }

    if (!this.isStrongPassword()) {

      this.showMessage(
        'Password must be at least 8 characters and include uppercase, lowercase, number and special character.',
        'error'
      );

      return false;
    }

    if (!this.passwordsMatch()) {

      this.showMessage(
        'Passwords do not match.',
        'error'
      );

      return false;
    }

    if (!this.files.profilePhoto) {

      this.showMessage(
        'Please upload your profile photo.',
        'error'
      );

      return false;
    }

    if (!this.files.medicalLicense) {

      this.showMessage(
        'Please upload your medical license.',
        'error'
      );

      return false;
    }

    if (!this.files.aadhaar) {

      this.showMessage(
        'Please upload your Aadhaar card.',
        'error'
      );

      return false;
    }

    if (!this.files.qualification) {

      this.showMessage(
        'Please upload your qualification certificate.',
        'error'
      );

      return false;
    }

    if (!this.termsAccepted) {

      this.showMessage(
        'Please accept the Terms & Conditions and Privacy Policy.',
        'error'
      );

      return false;
    }

    return true;
  }

  /* =========================
     REGISTER
  ========================= */

  registerDoctor(): void {

    if (!this.validateForm()) {
      return;
    }

    /*
      Frontend-only registration for now.

      Later this method can be connected
      to your backend API.
    */

    const registrationData = {
      ...this.doctor,
      documents: this.files
    };

    console.log(
      'Doctor Registration Data:',
      registrationData
    );

    this.showMessage(
      'Doctor registration completed successfully!',
      'success'
    );
  }

  /* =========================
     MESSAGE
  ========================= */

  showMessage(
    message: string,
    type: 'success' | 'error'
  ): void {

    this.message = message;
    this.messageType = type;

    setTimeout(() => {

      this.message = '';

    }, 3500);
  }

  /* =========================
     RESET FORM
  ========================= */

  resetForm(): void {

    this.doctor = {
      fullName: '',
      gender: '',
      dateOfBirth: '',
      bloodGroup: '',
      maritalStatus: '',
      nationality: '',

      registrationNumber: '',
      specialization: '',
      experience: null,
      qualification: '',
      college: '',
      passingYear: '',
      consultationType: '',
      consultationFee: null,
      workingAt: '',

      mobile: '',
      email: '',
      alternateMobile: '',

      address1: '',
      address2: '',
      city: '',
      state: '',
      district: '',
      pincode: '',

      password: '',
      confirmPassword: ''
    };

    this.files = {
      profilePhoto: null,
      medicalLicense: null,
      aadhaar: null,
      qualification: null,
      experience: null
    };

    this.termsAccepted = false;

    this.passwordVisible = false;
    this.confirmPasswordVisible = false;

    this.message = '';
  }
}