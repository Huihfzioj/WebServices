import { BirthCertificate, DeathCertificate, MarriageCertificate } from "@/types/certificate";

const SOAP_ENDPOINT = "/CivilRegistry";
const SOAP_NAMESPACE = "http://civilregistry.example.com/ws";

const createSoapEnvelope = (body: string): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="${SOAP_NAMESPACE}">
  <soapenv:Header/>
  <soapenv:Body>
    ${body}
  </soapenv:Body>
</soapenv:Envelope>`;
};

const sendSoapRequest = async (soapBody: string): Promise<Document> => {
  const response = await fetch(SOAP_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=UTF-8",
      "SOAPAction": '""',
    },
    body: soapBody,
  });

  if (!response.ok) {
    throw new Error(`SOAP request failed: ${response.status}`);
  }

  const text = await response.text();
  const parser = new DOMParser();
  return parser.parseFromString(text, "text/xml");
};

export const civilRegistryService = {
  async createBirthCertificate(cert: BirthCertificate): Promise<boolean> {
    try {
      const soapBody = createSoapEnvelope(`
    <tns:createBirthCertificate>
      <request>
        <certificateNumber>${cert.certificateNumber}</certificateNumber>
        <registrationDate>${cert.registrationDate}</registrationDate>
        <child>
          <nationalId>${cert.child.nationalId}</nationalId>
          <firstName>${cert.child.firstName}</firstName>
          <lastName>${cert.child.lastName}</lastName>
          <birthDate>${cert.child.birthDate}</birthDate>
          <birthPlace>${cert.child.birthPlace}</birthPlace>
          <fatherName>${cert.father.firstName} ${cert.father.lastName}</fatherName>
          <motherName>${cert.mother.firstName} ${cert.mother.lastName}</motherName>
          <gender>${cert.child.gender}</gender>
        </child>
      </request>
    </tns:createBirthCertificate>`);

      console.log("[CivilRegistry] Creating birth certificate:", soapBody);
      await sendSoapRequest(soapBody);
      console.log("[CivilRegistry] Birth certificate created successfully");
      return true;
    } catch (error) {
      console.error("[CivilRegistry] Failed to create birth certificate:", error);
      return false;
    }
  },

  async createDeathCertificate(cert: DeathCertificate): Promise<boolean> {
    try {
      // The SOAP service expects the complete structure
      const soapBody = createSoapEnvelope(`
    <tns:createDeathCertificate>
      <request>
        <certificateNumber>${cert.certificateNumber}</certificateNumber>
        <registrationDate>${cert.registrationDate}</registrationDate>
        <nationalID>${cert.nationalID}</nationalID>
        <deathDate>${cert.deathDate}</deathDate>
        <placeOfDeath>${cert.placeOfDeath}</placeOfDeath>
        <causeOfDeath>${cert.causeOfDeath}</causeOfDeath>
      </request>
    </tns:createDeathCertificate>`);

      console.log("[CivilRegistry] Creating death certificate:", soapBody);
      await sendSoapRequest(soapBody);
      console.log("[CivilRegistry] Death certificate created successfully");
      return true;
    } catch (error) {
      console.error("[CivilRegistry] Failed to create death certificate:", error);
      return false;
    }
  },

  async createMarriageCertificate(cert: MarriageCertificate): Promise<boolean> {
    try {
      const soapBody = createSoapEnvelope(`
    <tns:createMarriageCertificate>
      <request>
        <certificateNumber>${cert.certificateNumber}</certificateNumber>
        <registrationDate>${cert.registrationDate}</registrationDate>
        <nationalIdOfSpouse1>${cert.nationalIdOfSpouse1}</nationalIdOfSpouse1>
        <nationalIdOfSpouse2>${cert.nationalIdOfSpouse2}</nationalIdOfSpouse2>
        <marriageDate>${cert.marriageDate}</marriageDate>
        <marriageLocation>${cert.marriageLocation}</marriageLocation>
      </request>
    </tns:createMarriageCertificate>`);

      console.log("[CivilRegistry] Creating marriage certificate:", soapBody);
      await sendSoapRequest(soapBody);
      console.log("[CivilRegistry] Marriage certificate created successfully");
      return true;
    } catch (error) {
      console.error("[CivilRegistry] Failed to create marriage certificate:", error);
      return false;
    }
  },
};
