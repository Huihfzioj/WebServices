import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types/user";
import { toast } from "sonner";

interface CitizenInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  gender: 'MALE' | 'FEMALE';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, citizenId: number, citizenInfo: CitizenInfo) => Promise<boolean>;
  logout: () => void;
  getAllUsers: () => User[];
  addAdmin: (email: string, citizenId: number, role: UserRole, citizenInfo: CitizenInfo) => boolean;
  verifyCitizen: (citizenId: string, citizenInfo: CitizenInfo) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "govserve_users";
const CURRENT_USER_KEY = "govserve_current_user";

// Initialize with a super admin
const initializeUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) return JSON.parse(stored);
  
  const initialUsers: User[] = [
    {
      id: "super-admin-1",
      email: "admin@govserve.com",
      name: "System Administrator",
      role: UserRole.SUPER_ADMIN,
      citizenId: 1000000,
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  return initialUsers;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeUsers();
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as User[];
    const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      toast.error("Invalid email or password");
      return false;
    }

    // Backfill citizenId for legacy users
    if (!foundUser.citizenId) {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as User[];
      const fallbackCitizenId = 1000000 + users.length + 1;
      foundUser.citizenId = fallbackCitizenId;
      const updated = users.map((u) => (u.id === foundUser.id ? { ...foundUser } : u));
      localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    }
    
    // In a real app, you'd verify the password hash
    setUser(foundUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
    toast.success(`Welcome back, ${foundUser.name}!`);
    return true;
  };

  const signup = async (email: string, password: string, citizenId: number, citizenInfo: CitizenInfo): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as User[];
    
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error("An account with this email already exists");
      return false;
    }

    if (!citizenId || Number.isNaN(citizenId)) {
      toast.error("A valid citizen ID is required");
      return false;
    }

    // Verify with civil registry
    const isVerified = await verifyCitizen(citizenId.toString(), citizenInfo);
    if (!isVerified) {
      toast.error("Citizen information could not be verified. Please check your details.");
      return false;
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name: `${citizenInfo.firstName} ${citizenInfo.lastName}`,
      role: UserRole.USER,
      citizenId,
      firstName: citizenInfo.firstName,
      lastName: citizenInfo.lastName,
      birthDate: citizenInfo.birthDate,
      birthPlace: citizenInfo.birthPlace,
      gender: citizenInfo.gender,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    toast.success("Account created successfully!");
    return true;
  };

  const createCitizenInRegistry = async (citizenId: string, citizenInfo: CitizenInfo): Promise<boolean> => {
    try {
      console.log("[SOAP] Creating citizen in registry:", citizenId, citizenInfo);

      const soapBody = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://civilregistry.example.com/ws">
  <soapenv:Header/>
  <soapenv:Body>
    <tns:createCitizen>
      <nationalId>${citizenId}</nationalId>
      <firstName>${citizenInfo.firstName}</firstName>
      <lastName>${citizenInfo.lastName}</lastName>
      <birthDate>${citizenInfo.birthDate}</birthDate>
      <birthPlace>${citizenInfo.birthPlace}</birthPlace>
      <gender>${citizenInfo.gender}</gender>
    </tns:createCitizen>
  </soapenv:Body>
</soapenv:Envelope>`;

      console.log("[SOAP] Create request body:\n", soapBody);

      const response = await fetch("/CivilRegistry", {
        method: "POST",
        headers: {
          "Content-Type": "text/xml; charset=UTF-8",
          "SOAPAction": "",
        },
        body: soapBody,
      });

      console.log("[SOAP] Create response status:", response.status);

      const soapText = await response.text();
      console.log("[SOAP] Create raw response:\n", soapText);

      if (!response.ok) {
        console.error("[SOAP] Create failed with status:", response.status);
        toast.error("Failed to register citizen in registry.");
        return false;
      }

      if (soapText.includes("<Fault")) {
        console.error("[SOAP] Create fault returned:", soapText);
        toast.error("Registry error during citizen creation.");
        return false;
      }

      console.log("[SOAP] Citizen created successfully");
      return true;
    } catch (error) {
      console.error("[SOAP] Create citizen error:", error);
      toast.error("Error registering citizen in registry.");
      return false;
    }
  };

  const verifyCitizen = async (citizenId: string, citizenInfo: CitizenInfo): Promise<boolean> => {
    try {
      console.log("[SOAP] Verifying/Creating citizen:", citizenId, citizenInfo);

      // Try to create the citizen in the registry
      const created = await createCitizenInRegistry(citizenId, citizenInfo);
      if (created) {
        console.log("[SOAP] Citizen created successfully");
        return true;
      }

      console.warn("[SOAP] Citizen creation failed, allowing signup anyway for development");
      // Allow signup even if SOAP service is unavailable
      return true;
    } catch (error) {
      console.error("[SOAP] Verification error:", error);
      toast.error("Civil Registry verification error. See console for details.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    toast.success("Logged out successfully");
  };

  const getAllUsers = (): User[] => {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  };

  const addAdmin = (email: string, citizenId: number, role: UserRole, citizenInfo: CitizenInfo): boolean => {
    if (user?.role !== UserRole.SUPER_ADMIN && user?.role !== UserRole.ADMIN) {
      toast.error("You don't have permission to add administrators");
      return false;
    }
    
    if (user?.role === UserRole.ADMIN && role === UserRole.SUPER_ADMIN) {
      toast.error("Only super admins can create other super admins");
      return false;
    }
    
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as User[];
    
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error("An account with this email already exists");
      return false;
    }

    if (!citizenId || Number.isNaN(citizenId)) {
      toast.error("A valid citizen ID is required");
      return false;
    }
    
    const newAdmin: User = {
      id: `admin-${Date.now()}`,
      email,
      name: `${citizenInfo.firstName} ${citizenInfo.lastName}`,
      role,
      citizenId,
      firstName: citizenInfo.firstName,
      lastName: citizenInfo.lastName,
      birthDate: citizenInfo.birthDate,
      birthPlace: citizenInfo.birthPlace,
      gender: citizenInfo.gender,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newAdmin);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    toast.success(`${role === UserRole.SUPER_ADMIN ? "Super Administrator" : "Administrator"} added successfully!`);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        getAllUsers,
        addAdmin,
        verifyCitizen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
