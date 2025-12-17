export interface Certificate {
  certificateNumber: string;
  registrationDate: string;
}

export interface BirthCertificate extends Certificate {
  child: {
    nationalId: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    birthPlace: string;
    gender: 'MALE' | 'FEMALE';
  };
  mother: {
    nationalId: string;
    firstName: string;
    lastName: string;
  };
  father: {
    nationalId: string;
    firstName: string;
    lastName: string;
  };
}

export interface DeathCertificate extends Certificate {
  nationalID: string;
  deathDate: string;
  placeOfDeath: string;
  causeOfDeath: string;
}

export interface MarriageCertificate extends Certificate {
  nationalIdOfSpouse1: string;
  nationalIdOfSpouse2: string;
  marriageDate: string;
  marriageLocation: string;
}

export type CertificateType = 'BIRTH_CERTIFICATE' | 'DEATH_CERTIFICATE' | 'MARRIAGE_CERTIFICATE';

export interface CertificateRequest {
  type: CertificateType;
  data: BirthCertificate | DeathCertificate | MarriageCertificate;
}
