export interface Citizen {
  id: number;
  nationalId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  gender: 'MALE' | 'FEMALE';
  fatherNationalId?: string;
  motherNationalId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BirthCertificateRecord {
  id: number;
  certificateNumber: string;
  childNationalId: string;
  childFirstName: string;
  childLastName: string;
  childBirthDate: string;
  childBirthPlace: string;
  childGender: 'MALE' | 'FEMALE';
  fatherNationalId: string;
  fatherFirstName: string;
  fatherLastName: string;
  motherNationalId: string;
  motherFirstName: string;
  motherLastName: string;
  registrationDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarriageCertificateRecord {
  id: number;
  certificateNumber: string;
  spouse1NationalId: string;
  spouse1FirstName: string;
  spouse1LastName: string;
  spouse2NationalId: string;
  spouse2FirstName: string;
  spouse2LastName: string;
  marriageDate: string;
  marriagePlace: string;
  registrationDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DeathCertificateRecord {
  id: number;
  certificateNumber: string;
  deceasedNationalId: string;
  deceasedFirstName: string;
  deceasedLastName: string;
  deathDate: string;
  deathPlace: string;
  causeOfDeath: string;
  registrationDate: string;
  createdAt?: string;
  updatedAt?: string;
}
