import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

type LanguageCode = 'en' | 'mr' | 'hi';

interface Role {
  id: string;
  icon: string;
  route: string;
}

interface LocalizedRole {
  title: string;
  description: string[];
}

interface PageCopy {
  language: string;
  onePlatform: string;
  sevenRoles: string;
  sidebarIntro: string;
  securePrivate: string;
  securePrivateDetail: string;
  roleBasedAccess: string;
  roleBasedAccessDetail: string;
  betterCollaboration: string;
  betterCollaborationDetail: string;
  helpSupport: string;
  welcome: string;
  chooseRole: string;
  intro: string;
  continueAs: string;
  healthDataSafe: string;
  securityStandards: string;
  encryption: string;
  trusted: string;
  roles: Record<string, LocalizedRole>;
}

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-selection.html',
  styleUrls: ['./role-selection.css'],
})
export class RoleSelectionComponent {
  readonly languages: ReadonlyArray<{ code: LanguageCode; label: string }> = [
    { code: 'en', label: 'English' },
    { code: 'mr', label: 'मराठी' },
    { code: 'hi', label: 'हिंदी' },
  ];

  readonly roles: Role[] = [
    { id: 'patient', icon: 'fa-user', route: '/auth/patient/login' },
    { id: 'doctor', icon: 'fa-stethoscope', route: '/auth/doctor/login' },
    { id: 'hospital', icon: 'fa-hospital', route: '/auth/hospital/login' },
    { id: 'pharmacist', icon: 'fa-capsules', route: '/auth/pharmacist/login' },
    { id: 'laboratory', icon: 'fa-flask', route: '/auth/laboratory/login' },
    { id: 'ambulance', icon: 'fa-truck-medical', route: '/auth/ambulance/login' },
    { id: 'admin', icon: 'fa-user-shield', route: '/auth/admin/login' },
  ];

  readonly copy: Record<LanguageCode, PageCopy> = {
    en: {
      language: 'English',
      onePlatform: 'One Platform.',
      sevenRoles: 'Seven Roles.',
      sidebarIntro: 'Connected. Secure. Smarter Healthcare for everyone.',
      securePrivate: 'Secure & Private',
      securePrivateDetail: 'Your data is encrypted and protected with advanced security.',
      roleBasedAccess: 'Role Based Access',
      roleBasedAccessDetail: 'Each role has specific access to modules and features.',
      betterCollaboration: 'Better Collaboration',
      betterCollaborationDetail: 'Seamless connection between patients, providers and services.',
      helpSupport: 'Help & Support',
      welcome: 'WELCOME TO JEEVANDAN HEALTH CARD',
      chooseRole: 'Choose Your Role',
      intro: 'Select your role to continue to your personalized dashboard',
      continueAs: 'Continue as',
      healthDataSafe: 'Your health data is safe with us.',
      securityStandards: 'We follow strict security standards and privacy policies.',
      encryption: '256-bit SSL Encryption',
      trusted: '100% Secure and Trusted',
      roles: {
        patient: { title: 'Patient', description: ['Access your health records,', 'book appointments and', 'manage your health.'] },
        doctor: { title: 'Doctor', description: ['Manage appointments, view', 'patient history and provide', 'better care.'] },
        hospital: { title: 'Hospital', description: ['Manage patients, beds,', 'staff and hospital', 'operations efficiently.'] },
        pharmacist: { title: 'Pharmacist', description: ['Manage medicines, process', 'orders and maintain', 'inventory.'] },
        laboratory: { title: 'Laboratory', description: ['Manage test requests,', 'reports and laboratory', 'operations.'] },
        ambulance: { title: 'Ambulance / Emergency', description: ['Handle emergency requests,', 'track location and provide', 'quick response.'] },
        admin: { title: 'Admin', description: ['Manage users, roles, system', 'settings and overall', 'platform.'] },
      },
    },
    mr: {
      language: 'मराठी',
      onePlatform: 'एक व्यासपीठ.',
      sevenRoles: 'सात भूमिका.',
      sidebarIntro: 'सर्वांसाठी जोडलेली, सुरक्षित आणि अधिक स्मार्ट आरोग्यसेवा.',
      securePrivate: 'सुरक्षित आणि खाजगी',
      securePrivateDetail: 'तुमचा डेटा एनक्रिप्टेड असून प्रगत सुरक्षेद्वारे संरक्षित आहे.',
      roleBasedAccess: 'भूमिकेनुसार प्रवेश',
      roleBasedAccessDetail: 'प्रत्येक भूमिकेला मॉड्यूल्स आणि वैशिष्ट्यांचा विशिष्ट प्रवेश आहे.',
      betterCollaboration: 'उत्तम समन्वय',
      betterCollaborationDetail: 'रुग्ण, सेवा प्रदाते आणि सेवांमधील सुलभ जोडणी.',
      helpSupport: 'मदत आणि समर्थन',
      welcome: 'जीवदान हेल्थ कार्डमध्ये आपले स्वागत आहे',
      chooseRole: 'तुमची भूमिका निवडा',
      intro: 'तुमच्या वैयक्तिक डॅशबोर्डवर जाण्यासाठी तुमची भूमिका निवडा',
      continueAs: 'पुढे जा:',
      healthDataSafe: 'तुमचा आरोग्यविषयक डेटा आमच्याकडे सुरक्षित आहे.',
      securityStandards: 'आम्ही कठोर सुरक्षा मानके आणि गोपनीयता धोरणे पाळतो.',
      encryption: '256-बिट SSL एनक्रिप्शन',
      trusted: '100% सुरक्षित आणि विश्वासार्ह',
      roles: {
        patient: { title: 'रुग्ण', description: ['तुमच्या आरोग्य नोंदी पहा,', 'भेटी बुक करा आणि', 'आरोग्य सांभाळा.'] },
        doctor: { title: 'डॉक्टर', description: ['भेटी व्यवस्थापित करा,', 'रुग्णांचा इतिहास पहा आणि', 'उत्तम उपचार द्या.'] },
        hospital: { title: 'रुग्णालय', description: ['रुग्ण, खाटा आणि कर्मचारी', 'व्यवस्थापित करा आणि कामकाज', 'कार्यक्षमपणे सांभाळा.'] },
        pharmacist: { title: 'फार्मासिस्ट', description: ['औषधे व्यवस्थापित करा,', 'ऑर्डर प्रक्रिया करा आणि', 'साठा सांभाळा.'] },
        laboratory: { title: 'प्रयोगशाळा', description: ['तपासणी विनंत्या, अहवाल', 'आणि प्रयोगशाळेचे कामकाज', 'व्यवस्थापित करा.'] },
        ambulance: { title: 'रुग्णवाहिका / आपत्कालीन', description: ['आपत्कालीन विनंत्या हाताळा,', 'स्थानाचा मागोवा घ्या आणि', 'त्वरित प्रतिसाद द्या.'] },
        admin: { title: 'प्रशासक', description: ['वापरकर्ते, भूमिका आणि', 'सिस्टम सेटिंग्ज व्यवस्थापित', 'करा.'] },
      },
    },
    hi: {
      language: 'हिंदी',
      onePlatform: 'एक मंच.',
      sevenRoles: 'सात भूमिकाएँ.',
      sidebarIntro: 'सभी के लिए जुड़ी हुई, सुरक्षित और बेहतर स्वास्थ्य सेवा।',
      securePrivate: 'सुरक्षित और निजी',
      securePrivateDetail: 'आपका डेटा एन्क्रिप्टेड है और उन्नत सुरक्षा से सुरक्षित है।',
      roleBasedAccess: 'भूमिका आधारित पहुँच',
      roleBasedAccessDetail: 'हर भूमिका को मॉड्यूल और सुविधाओं की विशेष पहुँच मिलती है।',
      betterCollaboration: 'बेहतर सहयोग',
      betterCollaborationDetail: 'मरीजों, प्रदाताओं और सेवाओं के बीच सहज जुड़ाव।',
      helpSupport: 'सहायता और समर्थन',
      welcome: 'जीवदान हेल्थ कार्ड में आपका स्वागत है',
      chooseRole: 'अपनी भूमिका चुनें',
      intro: 'अपने व्यक्तिगत डैशबोर्ड पर जाने के लिए अपनी भूमिका चुनें',
      continueAs: 'इस रूप में आगे बढ़ें:',
      healthDataSafe: 'आपका स्वास्थ्य डेटा हमारे पास सुरक्षित है।',
      securityStandards: 'हम सख्त सुरक्षा मानकों और गोपनीयता नीतियों का पालन करते हैं।',
      encryption: '256-बिट SSL एन्क्रिप्शन',
      trusted: '100% सुरक्षित और विश्वसनीय',
      roles: {
        patient: { title: 'मरीज', description: ['अपने स्वास्थ्य रिकॉर्ड देखें,', 'अपॉइंटमेंट बुक करें और', 'अपने स्वास्थ्य का प्रबंधन करें।'] },
        doctor: { title: 'डॉक्टर', description: ['अपॉइंटमेंट प्रबंधित करें,', 'मरीज का इतिहास देखें और', 'बेहतर देखभाल दें।'] },
        hospital: { title: 'अस्पताल', description: ['मरीजों, बिस्तरों और स्टाफ', 'का प्रबंधन करें और संचालन', 'कुशलता से चलाएँ।'] },
        pharmacist: { title: 'फार्मासिस्ट', description: ['दवाओं का प्रबंधन करें,', 'ऑर्डर प्रोसेस करें और', 'स्टॉक बनाए रखें।'] },
        laboratory: { title: 'प्रयोगशाला', description: ['जांच अनुरोध, रिपोर्ट और', 'प्रयोगशाला संचालन का', 'प्रबंधन करें।'] },
        ambulance: { title: 'एम्बुलेंस / आपातकालीन', description: ['आपातकालीन अनुरोध संभालें,', 'स्थान ट्रैक करें और', 'त्वरित प्रतिक्रिया दें।'] },
        admin: { title: 'प्रशासक', description: ['उपयोगकर्ता, भूमिकाएँ और', 'सिस्टम सेटिंग्स का प्रबंधन', 'करें।'] },
      },
    },
  };

  activeLanguage: LanguageCode = 'en';
  isLanguageMenuOpen = false;

  constructor(private readonly router: Router) {}

  get text(): PageCopy {
    return this.copy[this.activeLanguage];
  }

  get localizedRoles(): Array<Role & LocalizedRole> {
    return this.roles.map((role) => ({ ...role, ...this.text.roles[role.id] }));
  }

  toggleLanguageMenu(): void {
    this.isLanguageMenuOpen = !this.isLanguageMenuOpen;
  }

  selectLanguage(language: LanguageCode): void {
    this.activeLanguage = language;
    this.isLanguageMenuOpen = false;
  }

  selectRole(role: Role): void {
    void this.router.navigateByUrl(role.route);
  }

  trackByRole(_: number, role: Role): string {
    return role.id;
  }
}

