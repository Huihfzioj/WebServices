import { useAuth } from "@/contexts/AuthContext";
import { UserRole, ROLE_LABELS } from "@/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, User } from "lucide-react";

interface AdminsListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminsListDialog = ({ open, onOpenChange }: AdminsListDialogProps) => {
  const { getAllUsers } = useAuth();
  const users = getAllUsers();
  const admins = users.filter(
    (u) => u.role === UserRole.ADMIN || u.role === UserRole.SUPER_ADMIN
  );

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <ShieldCheck className="h-4 w-4 text-primary" />;
      case UserRole.ADMIN:
        return <Shield className="h-4 w-4 text-blue-600" />;
      default:
        return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return "bg-primary/10 text-primary border-primary/20";
      case UserRole.ADMIN:
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Administrator List</DialogTitle>
          <DialogDescription>
            All administrators with access to this system.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {getRoleIcon(admin.role)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{admin.name}</p>
                  <p className="text-sm text-muted-foreground">{admin.email}</p>
                </div>
              </div>
              <Badge className={getRoleBadgeClass(admin.role)}>
                {ROLE_LABELS[admin.role]}
              </Badge>
            </div>
          ))}

          {admins.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No administrators found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminsListDialog;
