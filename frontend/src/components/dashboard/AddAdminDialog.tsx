import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddAdminDialog = ({ open, onOpenChange }: AddAdminDialogProps) => {
  const { user, addAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [citizenId, setCitizenId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | ''>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const citizenIdNumber = Number(citizenId);
    if (!citizenId || Number.isNaN(citizenIdNumber)) {
      setIsSubmitting(false);
      return;
    }

    if (!firstName || !lastName || !birthDate || !birthPlace || !gender) {
      setIsSubmitting(false);
      return;
    }

    const success = addAdmin(email, citizenIdNumber, role, {
      firstName,
      lastName,
      birthDate,
      birthPlace,
      gender: gender as 'MALE' | 'FEMALE',
    });

    if (success) {
      onOpenChange(false);
      setEmail("");
      setFirstName("");
      setLastName("");
      setBirthDate("");
      setBirthPlace("");
      setGender("");
      setRole(UserRole.ADMIN);
      setCitizenId("");
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Administrator</DialogTitle>
          <DialogDescription>
            Create a new admin account with the specified role.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[600px] overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="citizenId">Citizen / National ID</Label>
            <Input
              id="citizenId"
              type="number"
              value={citizenId}
              onChange={(e) => setCitizenId(e.target.value)}
              placeholder="Enter national ID"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Date of Birth</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthPlace">Place of Birth</Label>
            <Input
              id="birthPlace"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              placeholder="City or town"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE' | '')}
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                {isSuperAdmin && (
                  <SelectItem value={UserRole.SUPER_ADMIN}>Super Administrator</SelectItem>
                )}
              </SelectContent>
            </Select>
            {!isSuperAdmin && (
              <p className="text-xs text-muted-foreground">
                Only super admins can create other super admins.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !gender}>
              {isSubmitting ? "Adding..." : "Add Admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdminDialog;
