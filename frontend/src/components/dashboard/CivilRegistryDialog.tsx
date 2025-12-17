import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Users, FileText, Heart, AlertCircle, RefreshCw } from "lucide-react";
import { Citizen, BirthCertificateRecord, MarriageCertificateRecord, DeathCertificateRecord } from "@/types/citizen";
import { useToast } from "@/hooks/use-toast";

interface CivilRegistryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CivilRegistryDialog = ({ open, onOpenChange }: CivilRegistryDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [birthCerts, setBirthCerts] = useState<BirthCertificateRecord[]>([]);
  const [marriageCerts, setMarriageCerts] = useState<MarriageCertificateRecord[]>([]);
  const [deathCerts, setDeathCerts] = useState<DeathCertificateRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch citizens when dialog opens
  useEffect(() => {
    if (open) {
      refreshAll();
    }
  }, [open]);

  const refreshAll = () => {
    fetchCitizens();
    fetchBirthCertificates();
    fetchMarriageCertificates();
    fetchDeathCertificates();
  };

  const fetchCitizens = async () => {
    setLoading(true);
    try {
      const soapBody = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://civilregistry.example.com/ws">
  <soapenv:Header/>
  <soapenv:Body>
    <tns:getAllCitizens/>
  </soapenv:Body>
</soapenv:Envelope>`;

      console.log("[SOAP] getAllCitizens request:\n", soapBody);

      const response = await fetch("/CivilRegistry", {
        method: "POST",
        headers: { 
          "Content-Type": "text/xml; charset=UTF-8",
          "SOAPAction": "\"\""
        },
        body: soapBody,
      });

      if (!response.ok) {
        console.error("[SOAP] getAllCitizens failed with status:", response.status);
        throw new Error(`SOAP request failed: ${response.status}`);
      }

      const text = await response.text();
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      
      // The return elements have NO namespace prefix in the actual response
      const returnElements = xmlDoc.getElementsByTagName("return");
      
      const citizensList: Citizen[] = [];
      
      for (let i = 0; i < returnElements.length; i++) {
        const elem = returnElements[i];
        const getId = (tagName: string) => {
          return elem.getElementsByTagName(tagName)[0]?.textContent || "";
        };
        
        citizensList.push({
          id: parseInt(getId("id")) || i,
          nationalId: getId("nationalId"),
          firstName: getId("firstName"),
          lastName: getId("lastName"),
          birthDate: getId("birthDate"),
          birthPlace: getId("birthPlace"),
          gender: (getId("gender") || "MALE") as 'MALE' | 'FEMALE',
          fatherNationalId: getId("fatherName"),
          motherNationalId: getId("motherName"),
        });
      }
      
      setCitizens(citizensList);
    } catch (error) {
      console.error("Failed to fetch citizens:", error);
      toast({
        title: "Error",
        description: "Failed to fetch citizens",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBirthCertificates = async () => {
    setLoading(true);
    try {
      const soapBody = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://civilregistry.example.com/ws">
  <soapenv:Header/>
  <soapenv:Body>
    <tns:getAllBirthCertificates/>
  </soapenv:Body>
</soapenv:Envelope>`;

      console.log("[SOAP] getAllBirthCertificates request:\n", soapBody);

      const response = await fetch("/CivilRegistry", {
        method: "POST",
        headers: { 
          "Content-Type": "text/xml; charset=UTF-8",
          "SOAPAction": ""
        },
        body: soapBody,
      });

      console.log("[SOAP] getAllBirthCertificates response status:", response.status);

      const text = await response.text();
      console.log("[SOAP] getAllBirthCertificates raw response:\n", text);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      
      const returnElements = xmlDoc.getElementsByTagName("return");
      const certsList: BirthCertificateRecord[] = [];
      
      for (let i = 0; i < returnElements.length; i++) {
        const elem = returnElements[i];
        const getId = (tagName: string) => elem.getElementsByTagName(tagName)[0]?.textContent || "";
        const childElem = elem.getElementsByTagName("child")[0];
        const getChildId = (tagName: string) => childElem?.getElementsByTagName(tagName)[0]?.textContent || "";
        
        certsList.push({
          id: parseInt(getId("id")) || i,
          certificateNumber: getId("certificateNumber"),
          childNationalId: getChildId("nationalId"),
          childFirstName: getChildId("firstName"),
          childLastName: getChildId("lastName"),
          childBirthDate: getChildId("birthDate"),
          childBirthPlace: getChildId("birthPlace"),
          childGender: (getChildId("gender") || "MALE") as 'MALE' | 'FEMALE',
          fatherNationalId: "",
          fatherFirstName: getChildId("fatherName"),
          fatherLastName: "",
          motherNationalId: "",
          motherFirstName: getChildId("motherName"),
          motherLastName: "",
          registrationDate: getId("registrationDate"),
        });
      }
      
      setBirthCerts(certsList);
    } catch (error) {
      console.error("Failed to fetch birth certificates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch birth certificates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMarriageCertificates = async () => {
    setLoading(true);
    try {
      const citizensMap = new Map<string, Citizen>();
      citizens.forEach(c => citizensMap.set(c.nationalId, c));

      const soapBody = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://civilregistry.example.com/ws">
  <soapenv:Header/>
  <soapenv:Body>
    <tns:getAllMarriageCertificates/>
  </soapenv:Body>
</soapenv:Envelope>`;

      console.log("[SOAP] getAllMarriageCertificates request:\n", soapBody);

      const response = await fetch("/CivilRegistry", {
        method: "POST",
        headers: { 
          "Content-Type": "text/xml; charset=UTF-8",
          "SOAPAction": ""
        },
        body: soapBody,
      });

      console.log("[SOAP] getAllMarriageCertificates response status:", response.status);

      const text = await response.text();
      console.log("[SOAP] getAllMarriageCertificates raw response:\n", text);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      
      const returnElements = xmlDoc.getElementsByTagName("return");
      const certsList: MarriageCertificateRecord[] = [];
      
      for (let i = 0; i < returnElements.length; i++) {
        const elem = returnElements[i];
        const getId = (tagName: string) => elem.getElementsByTagName(tagName)[0]?.textContent || "";
        
        const spouse1Id = getId("nationalIdOfSpouse1");
        const spouse2Id = getId("nationalIdOfSpouse2");
        const spouse1 = citizensMap.get(spouse1Id);
        const spouse2 = citizensMap.get(spouse2Id);
        
        certsList.push({
          id: parseInt(getId("id")) || i,
          certificateNumber: getId("certificateNumber"),
          spouse1NationalId: spouse1Id,
          spouse1FirstName: spouse1?.firstName || "",
          spouse1LastName: spouse1?.lastName || "",
          spouse2NationalId: spouse2Id,
          spouse2FirstName: spouse2?.firstName || "",
          spouse2LastName: spouse2?.lastName || "",
          marriageDate: getId("marriageDate"),
          marriagePlace: getId("marriageLocation"),
          registrationDate: getId("registrationDate"),
        });
      }
      
      setMarriageCerts(certsList);
    } catch (error) {
      console.error("Failed to fetch marriage certificates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch marriage certificates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDeathCertificates = async () => {
    setLoading(true);
    try {
      const citizensMap = new Map<string, Citizen>();
      citizens.forEach(c => citizensMap.set(c.nationalId, c));

      const soapBody = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://civilregistry.example.com/ws">
  <soapenv:Header/>
  <soapenv:Body>
    <tns:getAllDeathCertificates/>
  </soapenv:Body>
</soapenv:Envelope>`;

      console.log("[SOAP] getAllDeathCertificates request:\n", soapBody);

      const response = await fetch("/CivilRegistry", {
        method: "POST",
        headers: { 
          "Content-Type": "text/xml; charset=UTF-8",
          "SOAPAction": ""
        },
        body: soapBody,
      });

      console.log("[SOAP] getAllDeathCertificates response status:", response.status);

      const text = await response.text();
      console.log("[SOAP] getAllDeathCertificates raw response:\n", text);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      
      const returnElements = xmlDoc.getElementsByTagName("return");
      const certsList: DeathCertificateRecord[] = [];
      
      for (let i = 0; i < returnElements.length; i++) {
        const elem = returnElements[i];
        const getId = (tagName: string) => elem.getElementsByTagName(tagName)[0]?.textContent || "";
        
        const citizenId = getId("nationalID");
        const deceased = citizensMap.get(citizenId);
        
        certsList.push({
          id: parseInt(getId("id")) || i,
          certificateNumber: getId("certificateNumber"),
          deceasedNationalId: citizenId,
          deceasedFirstName: deceased?.firstName || "",
          deceasedLastName: deceased?.lastName || "",
          deathDate: getId("deathDate"),
          deathPlace: getId("placeOfDeath"),
          causeOfDeath: getId("causeOfDeath"),
          registrationDate: getId("registrationDate"),
        });
      }
      
      setDeathCerts(certsList);
    } catch (error) {
      console.error("Failed to fetch death certificates:", error);
      toast({
        title: "Error",
        description: "Failed to fetch death certificates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = async (value: string) => {
    setSearchTerm("");
    if (value === "citizens" && citizens.length === 0) {
      await fetchCitizens();
    }
    if (value === "birth" && birthCerts.length === 0) {
      await fetchBirthCertificates();
    }
    if (value === "marriage" && marriageCerts.length === 0) {
      if (citizens.length === 0) await fetchCitizens();
      await fetchMarriageCertificates();
    }
    if (value === "death" && deathCerts.length === 0) {
      if (citizens.length === 0) await fetchCitizens();
      await fetchDeathCertificates();
    }
  };

  const filteredCitizens = citizens.filter(c => 
    c.nationalId.includes(searchTerm) ||
    c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBirthCerts = birthCerts.filter(c =>
    c.certificateNumber.includes(searchTerm) ||
    c.childNationalId.includes(searchTerm) ||
    c.childFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.childLastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMarriageCerts = marriageCerts.filter(c =>
    c.certificateNumber.includes(searchTerm) ||
    c.spouse1NationalId.includes(searchTerm) ||
    c.spouse2NationalId.includes(searchTerm) ||
    c.spouse1FirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.spouse2FirstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeathCerts = deathCerts.filter(c =>
    c.certificateNumber.includes(searchTerm) ||
    c.deceasedNationalId.includes(searchTerm) ||
    c.deceasedFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.deceasedLastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Civil Registry
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshAll}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </DialogHeader>

        <div className="mb-4">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by ID, name, or certificate number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="citizens" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="citizens">
              <Users className="h-4 w-4 mr-2" />
              Citizens ({citizens.length})
            </TabsTrigger>
            <TabsTrigger value="birth">
              <FileText className="h-4 w-4 mr-2" />
              Birth ({birthCerts.length})
            </TabsTrigger>
            <TabsTrigger value="marriage">
              <Heart className="h-4 w-4 mr-2" />
              Marriage ({marriageCerts.length})
            </TabsTrigger>
            <TabsTrigger value="death">
              <AlertCircle className="h-4 w-4 mr-2" />
              Death ({deathCerts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="citizens">
            <ScrollArea className="h-[500px] pr-4">
              {loading ? (
                <p className="text-center py-8 text-muted-foreground">Loading citizens...</p>
              ) : filteredCitizens.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No citizens found</p>
              ) : (
                <div className="space-y-3">
                  {filteredCitizens.map((citizen) => (
                    <Card key={citizen.id}>
                      <CardContent className="py-4">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">National ID</p>
                            <p className="font-semibold">{citizen.nationalId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Name</p>
                            <p className="font-semibold">{citizen.firstName} {citizen.lastName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Gender</p>
                            <Badge variant={citizen.gender === 'MALE' ? 'default' : 'secondary'}>
                              {citizen.gender}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Birth Date</p>
                            <p className="text-sm">{new Date(citizen.birthDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Birth Place</p>
                            <p className="text-sm">{citizen.birthPlace}</p>
                          </div>
                          {(citizen.fatherNationalId || citizen.motherNationalId) && (
                            <div>
                              <p className="text-xs text-muted-foreground uppercase">Parents</p>
                              {citizen.fatherNationalId && <p className="text-sm">Father: {citizen.fatherNationalId}</p>}
                              {citizen.motherNationalId && <p className="text-sm">Mother: {citizen.motherNationalId}</p>}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="birth">
            <ScrollArea className="h-[500px] pr-4">
              {loading ? (
                <p className="text-center py-8 text-muted-foreground">Loading birth certificates...</p>
              ) : filteredBirthCerts.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No birth certificates found</p>
              ) : (
                <div className="space-y-3">
                  {filteredBirthCerts.map((cert) => (
                    <Card key={cert.id}>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center justify-between">
                          <span>Certificate #{cert.certificateNumber}</span>
                          <Badge>{cert.childGender}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Child</p>
                            <p className="font-semibold">{cert.childFirstName} {cert.childLastName}</p>
                            <p className="text-sm text-muted-foreground">{cert.childNationalId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Birth Date & Place</p>
                            <p className="text-sm">{new Date(cert.childBirthDate).toLocaleDateString()}</p>
                            <p className="text-sm text-muted-foreground">{cert.childBirthPlace}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Father</p>
                            <p className="text-sm font-medium">{cert.fatherFirstName} {cert.fatherLastName}</p>
                            <p className="text-sm text-muted-foreground">{cert.fatherNationalId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Mother</p>
                            <p className="text-sm font-medium">{cert.motherFirstName} {cert.motherLastName}</p>
                            <p className="text-sm text-muted-foreground">{cert.motherNationalId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Registration Date</p>
                            <p className="text-sm">{new Date(cert.registrationDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="marriage">
            <ScrollArea className="h-[500px] pr-4">
              {loading ? (
                <p className="text-center py-8 text-muted-foreground">Loading marriage certificates...</p>
              ) : filteredMarriageCerts.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No marriage certificates found</p>
              ) : (
                <div className="space-y-3">
                  {filteredMarriageCerts.map((cert) => (
                    <Card key={cert.id}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Certificate #{cert.certificateNumber}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Spouse 1</p>
                            <p className="font-semibold">{cert.spouse1FirstName} {cert.spouse1LastName}</p>
                            <p className="text-sm text-muted-foreground">{cert.spouse1NationalId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Spouse 2</p>
                            <p className="font-semibold">{cert.spouse2FirstName} {cert.spouse2LastName}</p>
                            <p className="text-sm text-muted-foreground">{cert.spouse2NationalId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Marriage Date</p>
                            <p className="text-sm">{new Date(cert.marriageDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Marriage Place</p>
                            <p className="text-sm">{cert.marriagePlace}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Registration Date</p>
                            <p className="text-sm">{new Date(cert.registrationDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="death">
            <ScrollArea className="h-[500px] pr-4">
              {loading ? (
                <p className="text-center py-8 text-muted-foreground">Loading death certificates...</p>
              ) : filteredDeathCerts.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No death certificates found</p>
              ) : (
                <div className="space-y-3">
                  {filteredDeathCerts.map((cert) => (
                    <Card key={cert.id}>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Certificate #{cert.certificateNumber}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Deceased</p>
                            <p className="font-semibold">{cert.deceasedFirstName} {cert.deceasedLastName}</p>
                            <p className="text-sm text-muted-foreground">{cert.deceasedNationalId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Death Date</p>
                            <p className="text-sm">{new Date(cert.deathDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Death Place</p>
                            <p className="text-sm">{cert.deathPlace}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Cause of Death</p>
                            <p className="text-sm">{cert.causeOfDeath}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">Registration Date</p>
                            <p className="text-sm">{new Date(cert.registrationDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CivilRegistryDialog;
