import { useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestType, REQUEST_TYPE_LABELS } from "@/types/request";
import { BirthCertificate, DeathCertificate, MarriageCertificate } from "@/types/certificate";
import { Upload, X, FileText, Send, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRequests } from "@/hooks/useRequests";
import { useAuth } from "@/contexts/AuthContext";
import CertificateForm from "./CertificateForm";

const RequestForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createRequest, loading } = useRequests();
  const { user } = useAuth();
  
  const preselectedType = searchParams.get("type") as RequestType | null;

  const [formData, setFormData] = useState({
    type: preselectedType || "",
    comment: "",
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [certificateData, setCertificateData] = useState<
    BirthCertificate | DeathCertificate | MarriageCertificate | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type) {
      toast({
        title: "Validation Error",
        description: "Please select a request type.",
        variant: "destructive",
      });
      return;
    }

    if (!user || !user.citizenId) {
      toast({
        title: "Authentication Required",
        description: "Please login to submit a request.",
        variant: "destructive",
      });
      return;
    }

    // Add validation for certificate forms
    if (
      formData.type === RequestType.BIRTH_CERTIFICATE ||
      formData.type === RequestType.DEATH_CERTIFICATE ||
      formData.type === RequestType.MARRIAGE_CERTIFICATE
    ) {
      if (!certificateData) {
        toast({
          title: "Validation Error",
          description: "Please fill in the certificate details.",
          variant: "destructive",
        });
        return;
      }

      if (formData.type === RequestType.BIRTH_CERTIFICATE) {
        const birth = certificateData as BirthCertificate;
        if (
          !birth.child?.firstName ||
          !birth.child?.lastName ||
          !birth.child?.nationalId ||
          !birth.child?.birthDate ||
          !birth.child?.birthPlace ||
          !birth.child?.gender ||
          !birth.mother?.nationalId ||
          !birth.mother?.firstName ||
          !birth.mother?.lastName ||
          !birth.father?.nationalId ||
          !birth.father?.firstName ||
          !birth.father?.lastName
        ) {
          toast({
            title: "Validation Error",
            description: "Please fill in all birth certificate details including child, mother, and father information.",
            variant: "destructive",
          });
          return;
        }
      }

      if (formData.type === RequestType.DEATH_CERTIFICATE) {
        const death = certificateData as DeathCertificate;
        if (
          !death.nationalID ||
          !death.deathDate ||
          !death.placeOfDeath ||
          !death.causeOfDeath
        ) {
          toast({
            title: "Validation Error",
            description: "Please fill in all death certificate details.",
            variant: "destructive",
          });
          return;
        }
      }

      if (formData.type === RequestType.MARRIAGE_CERTIFICATE) {
        const marriage = certificateData as MarriageCertificate;
        if (
          !marriage.nationalIdOfSpouse1 ||
          !marriage.nationalIdOfSpouse2 ||
          !marriage.marriageDate ||
          !marriage.marriageLocation
        ) {
          toast({
            title: "Validation Error",
            description: "Please fill in all marriage certificate details.",
            variant: "destructive",
          });
          return;
        }
      }
    }

    console.log('[RequestForm] Submitting with comment:', formData.comment, 'attachments:', attachments.length);

    const newRequest = await createRequest({
      citizenID: user.citizenId,
      type: formData.type as RequestType,
      comment: formData.comment || "No additional comments",
      attachments: attachments.map(f => f.name),
    } as any);

    if (newRequest && newRequest.id) {
      // Store certificate data in sessionStorage if applicable
      if (certificateData && (
        formData.type === RequestType.BIRTH_CERTIFICATE ||
        formData.type === RequestType.DEATH_CERTIFICATE ||
        formData.type === RequestType.MARRIAGE_CERTIFICATE
      )) {
        try {
          const certificateDataMap = JSON.parse(sessionStorage.getItem('certificateDataMap') || '{}');
          certificateDataMap[newRequest.id] = certificateData;
          sessionStorage.setItem('certificateDataMap', JSON.stringify(certificateDataMap));
          console.log('[RequestForm] Certificate data stored in sessionStorage for request', newRequest.id);
        } catch (error) {
          console.warn('[RequestForm] Failed to store certificate data in sessionStorage:', error);
        }
      }
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-16 animate-fade-up">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 text-success mb-6">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Request Submitted!
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Your request has been submitted successfully. You will receive a confirmation 
          email with your request ID and tracking information.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate("/")}>
            Back to Home
          </Button>
          <Button variant="outline" onClick={() => {
            setIsSubmitted(false);
            setFormData({ type: "", comment: "" });
            setAttachments([]);
          }}>
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
      {/* Request Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Request Type *</Label>
        <Select value={formData.type} onValueChange={handleTypeChange} required>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select the type of request" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(RequestType).map((type) => (
              <SelectItem key={type} value={type}>
                {REQUEST_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Certificate Form for specific request types */}
      {(formData.type === RequestType.BIRTH_CERTIFICATE ||
        formData.type === RequestType.DEATH_CERTIFICATE ||
        formData.type === RequestType.MARRIAGE_CERTIFICATE) && (
        <CertificateForm
          certificateType={formData.type as RequestType}
          onDataChange={(data) =>
            setCertificateData(
              data as BirthCertificate | DeathCertificate | MarriageCertificate
            )
          }
        />
      )}

      {/* Comment */}
      <div className="space-y-2">
        <Label htmlFor="comment">Additional Information</Label>
        <Textarea
          id="comment"
          name="comment"
          placeholder="Provide any additional details about your request..."
          value={formData.comment}
          onChange={handleInputChange}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Include any relevant information that may help process your request faster
        </p>
      </div>

      {/* Attachments */}
      <div className="space-y-2">
        <Label>Attachments (Optional)</Label>
        <div
          className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-accent/50 hover:bg-muted/30 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            PDF, DOC, JPG, PNG (max 5 files, 10MB each)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Attachment List */}
        {attachments.length > 0 && (
          <div className="space-y-2 mt-4">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit Request
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By submitting this form, you agree to our{" "}
        <a href="#" className="text-accent hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-accent hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
};

export default RequestForm;
