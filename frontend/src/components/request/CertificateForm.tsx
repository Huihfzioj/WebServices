import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RequestType } from "@/types/request";
import { BirthCertificate, DeathCertificate, MarriageCertificate } from "@/types/certificate";
import { useAuth } from "@/contexts/AuthContext";

interface CertificateFormProps {
  certificateType: RequestType;
  onDataChange: (data: any) => void;
}

const generateCertificateNumber = (prefix: string): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${new Date().getFullYear()}-${timestamp}${random}`;
};

const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const CertificateForm = ({ certificateType, onDataChange }: CertificateFormProps) => {
  const today = getTodayDate();
  const { user } = useAuth();

  const [birthCertData, setBirthCertData] = useState<Partial<BirthCertificate>>({
    certificateNumber: generateCertificateNumber("BC"),
    registrationDate: today,
    child: {
      nationalId: "",
      firstName: "",
      lastName: "",
      birthDate: "",
      birthPlace: "",
      gender: "MALE",
    },
    mother: {
      nationalId: "",
      firstName: "",
      lastName: "",
    },
    father: {
      nationalId: "",
      firstName: "",
      lastName: "",
    },
  });

  const [deathCertData, setDeathCertData] = useState<Partial<DeathCertificate>>({
    certificateNumber: generateCertificateNumber("DC"),
    registrationDate: today,
    nationalID: "",
    deathDate: "",
    placeOfDeath: "",
    causeOfDeath: "",
  });

  const [marriageCertData, setMarriageCertData] = useState<Partial<MarriageCertificate>>({
    certificateNumber: generateCertificateNumber("MC"),
    registrationDate: today,
    nationalIdOfSpouse1: "",
    nationalIdOfSpouse2: "",
    marriageDate: "",
    marriageLocation: "",
  });

  // Auto-populate marriage certificate with current user's citizen ID
  useEffect(() => {
    if (certificateType === RequestType.MARRIAGE_CERTIFICATE && user?.citizenId) {
      setMarriageCertData((prev) => ({
        ...prev,
        nationalIdOfSpouse1: user.citizenId?.toString() || "",
      }));
    }
  }, [certificateType, user]);

  // Auto-populate birth certificate with current user's data based on gender
  useEffect(() => {
    if (certificateType === RequestType.BIRTH_CERTIFICATE && user) {
      setBirthCertData((prev) => {
        const updated = { ...prev };
        if (user.gender === 'MALE') {
          updated.father = {
            nationalId: user.citizenId?.toString() || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
          };
        } else if (user.gender === 'FEMALE') {
          updated.mother = {
            nationalId: user.citizenId?.toString() || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
          };
        }
        return updated;
      });
    }
  }, [certificateType, user]);

  const handleBirthCertChange = (field: string, value: any) => {
    const updated = { ...birthCertData };
    if (field.startsWith("child.")) {
      const childField = field.split(".")[1];
      updated.child = { ...updated.child!, [childField]: value };
    } else if (field.startsWith("mother.")) {
      const motherField = field.split(".")[1];
      updated.mother = { ...updated.mother!, [motherField]: value };
    } else if (field.startsWith("father.")) {
      const fatherField = field.split(".")[1];
      updated.father = { ...updated.father!, [fatherField]: value };
    } else {
      (updated as any)[field] = value;
    }
    setBirthCertData(updated);
    onDataChange(updated);
  };

  const handleDeathCertChange = (field: string, value: any) => {
    const updated = { ...deathCertData, [field]: value };
    setDeathCertData(updated);
    onDataChange(updated);
  };

  const handleMarriageCertChange = (field: string, value: any) => {
    const updated = { ...marriageCertData, [field]: value };
    setMarriageCertData(updated);
    onDataChange(updated);
  };

  if (certificateType === RequestType.BIRTH_CERTIFICATE) {
    return (
      <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
        <h3 className="font-semibold text-lg">Birth Certificate Details</h3>
        
        <div className="grid grid-cols-2 gap-4 p-3 bg-background rounded border border-border/50">
          <div className="space-y-2">
            <Label htmlFor="cert-number">Certificate Number</Label>
            <Input
              id="cert-number"
              value={birthCertData.certificateNumber}
              disabled
              className="bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Auto-generated</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-date">Registration Date</Label>
            <Input
              id="reg-date"
              type="date"
              value={birthCertData.registrationDate}
              disabled
              className="bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Today's date</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Child Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="child-national-id">National ID *</Label>
              <Input
                id="child-national-id"
                placeholder="Enter child's national ID"
                value={birthCertData.child?.nationalId}
                onChange={(e) => handleBirthCertChange("child.nationalId", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="child-first-name">First Name *</Label>
              <Input
                id="child-first-name"
                placeholder="First name"
                value={birthCertData.child?.firstName}
                onChange={(e) => handleBirthCertChange("child.firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="child-last-name">Last Name *</Label>
              <Input
                id="child-last-name"
                placeholder="Last name"
                value={birthCertData.child?.lastName}
                onChange={(e) => handleBirthCertChange("child.lastName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="child-birth-date">Birth Date *</Label>
              <Input
                id="child-birth-date"
                type="date"
                value={birthCertData.child?.birthDate}
                onChange={(e) => handleBirthCertChange("child.birthDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="child-birth-place">Birth Place *</Label>
              <Input
                id="child-birth-place"
                placeholder="City or hospital"
                value={birthCertData.child?.birthPlace}
                onChange={(e) => handleBirthCertChange("child.birthPlace", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="child-gender">Gender *</Label>
              <Select 
                value={birthCertData.child?.gender} 
                onValueChange={(value) => handleBirthCertChange("child.gender", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Mother Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mother-national-id">National ID *</Label>
              <Input
                id="mother-national-id"
                placeholder="Mother's national ID"
                value={birthCertData.mother?.nationalId}
                onChange={(e) => handleBirthCertChange("mother.nationalId", e.target.value)}
                disabled={user?.gender === 'FEMALE'}
                className={user?.gender === 'FEMALE' ? 'bg-muted cursor-not-allowed' : ''}
                required
              />
              {user?.gender === 'FEMALE' && (
                <p className="text-xs text-muted-foreground">Auto-filled from your profile</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mother-first-name">First Name *</Label>
              <Input
                id="mother-first-name"
                placeholder="First name"
                value={birthCertData.mother?.firstName}
                onChange={(e) => handleBirthCertChange("mother.firstName", e.target.value)}
                disabled={user?.gender === 'FEMALE'}
                className={user?.gender === 'FEMALE' ? 'bg-muted cursor-not-allowed' : ''}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mother-last-name">Last Name *</Label>
              <Input
                id="mother-last-name"
                placeholder="Last name"
                value={birthCertData.mother?.lastName}
                onChange={(e) => handleBirthCertChange("mother.lastName", e.target.value)}
                disabled={user?.gender === 'FEMALE'}
                className={user?.gender === 'FEMALE' ? 'bg-muted cursor-not-allowed' : ''}
                required
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Father Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="father-national-id">National ID *</Label>
              <Input
                id="father-national-id"
                placeholder="Father's national ID"
                value={birthCertData.father?.nationalId}
                onChange={(e) => handleBirthCertChange("father.nationalId", e.target.value)}
                disabled={user?.gender === 'MALE'}
                className={user?.gender === 'MALE' ? 'bg-muted cursor-not-allowed' : ''}
                required
              />
              {user?.gender === 'MALE' && (
                <p className="text-xs text-muted-foreground">Auto-filled from your profile</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="father-first-name">First Name *</Label>
              <Input
                id="father-first-name"
                placeholder="First name"
                value={birthCertData.father?.firstName}
                onChange={(e) => handleBirthCertChange("father.firstName", e.target.value)}
                disabled={user?.gender === 'MALE'}
                className={user?.gender === 'MALE' ? 'bg-muted cursor-not-allowed' : ''}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="father-last-name">Last Name *</Label>
              <Input
                id="father-last-name"
                placeholder="Last name"
                value={birthCertData.father?.lastName}
                onChange={(e) => handleBirthCertChange("father.lastName", e.target.value)}
                disabled={user?.gender === 'MALE'}
                className={user?.gender === 'MALE' ? 'bg-muted cursor-not-allowed' : ''}
                required
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (certificateType === RequestType.DEATH_CERTIFICATE) {
    return (
      <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
        <h3 className="font-semibold text-lg">Death Certificate Details</h3>
        
        <div className="grid grid-cols-2 gap-4 p-3 bg-background rounded border border-border/50">
          <div className="space-y-2">
            <Label htmlFor="cert-number">Certificate Number</Label>
            <Input
              id="cert-number"
              value={deathCertData.certificateNumber}
              disabled
              className="bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Auto-generated</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-date">Registration Date</Label>
            <Input
              id="reg-date"
              type="date"
              value={deathCertData.registrationDate}
              disabled
              className="bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Today's date</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="national-id">National ID *</Label>
            <Input
              id="national-id"
              placeholder="Deceased person's national ID"
              value={deathCertData.nationalID}
              onChange={(e) => handleDeathCertChange("nationalID", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="death-date">Death Date *</Label>
            <Input
              id="death-date"
              type="date"
              value={deathCertData.deathDate}
              onChange={(e) => handleDeathCertChange("deathDate", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="place-of-death">Place of Death *</Label>
            <Input
              id="place-of-death"
              placeholder="City or hospital"
              value={deathCertData.placeOfDeath}
              onChange={(e) => handleDeathCertChange("placeOfDeath", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cause-of-death">Cause of Death *</Label>
            <Input
              id="cause-of-death"
              placeholder="Medical cause"
              value={deathCertData.causeOfDeath}
              onChange={(e) => handleDeathCertChange("causeOfDeath", e.target.value)}
              required
            />
          </div>
        </div>
      </div>
    );
  }

  if (certificateType === RequestType.MARRIAGE_CERTIFICATE) {
    return (
      <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
        <h3 className="font-semibold text-lg">Marriage Certificate Details</h3>
        
        <div className="grid grid-cols-2 gap-4 p-3 bg-background rounded border border-border/50">
          <div className="space-y-2">
            <Label htmlFor="cert-number">Certificate Number</Label>
            <Input
              id="cert-number"
              value={marriageCertData.certificateNumber}
              disabled
              className="bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Auto-generated</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-date">Registration Date</Label>
            <Input
              id="reg-date"
              type="date"
              value={marriageCertData.registrationDate}
              disabled
              className="bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Today's date</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spouse1-id">Your National ID *</Label>
            <Input
              id="spouse1-id"
              placeholder="Your national ID"
              value={marriageCertData.nationalIdOfSpouse1}
              onChange={(e) => handleMarriageCertChange("nationalIdOfSpouse1", e.target.value)}
              disabled={!!user?.citizenId}
              className={user?.citizenId ? 'bg-muted cursor-not-allowed' : ''}
              required
            />
            {user?.citizenId && (
              <p className="text-xs text-muted-foreground">Auto-filled from your profile</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="spouse2-id">Spouse's National ID *</Label>
            <Input
              id="spouse2-id"
              placeholder="Your spouse's national ID"
              value={marriageCertData.nationalIdOfSpouse2}
              onChange={(e) => handleMarriageCertChange("nationalIdOfSpouse2", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marriage-date">Marriage Date *</Label>
            <Input
              id="marriage-date"
              type="date"
              value={marriageCertData.marriageDate}
              onChange={(e) => handleMarriageCertChange("marriageDate", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="marriage-location">Marriage Location *</Label>
            <Input
              id="marriage-location"
              placeholder="City or venue"
              value={marriageCertData.marriageLocation}
              onChange={(e) => handleMarriageCertChange("marriageLocation", e.target.value)}
              required
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CertificateForm;
