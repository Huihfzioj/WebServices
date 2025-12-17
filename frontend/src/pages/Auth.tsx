import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus, Shield } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupCitizenId, setSignupCitizenId] = useState("");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupBirthDate, setSignupBirthDate] = useState("");
  const [signupBirthPlace, setSignupBirthPlace] = useState("");
  const [signupGender, setSignupGender] = useState<'MALE' | 'FEMALE' | ''>("");

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await login(loginEmail, loginPassword);
    if (success) {
      navigate("/dashboard");
    }
    
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== signupConfirmPassword) {
      return;
    }
    
    setIsLoading(true);
    
    const citizenIdNumber = Number(signupCitizenId);
    if (!signupCitizenId || Number.isNaN(citizenIdNumber)) {
      setIsLoading(false);
      return;
    }

    if (!signupFirstName || !signupLastName || !signupBirthDate || !signupBirthPlace || !signupGender) {
      setIsLoading(false);
      return;
    }

    const success = await signup(signupEmail, signupPassword, citizenIdNumber, {
      firstName: signupFirstName,
      lastName: signupLastName,
      birthDate: signupBirthDate,
      birthPlace: signupBirthPlace,
      gender: signupGender as 'MALE' | 'FEMALE',
    });
    if (success) {
      navigate("/dashboard");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Welcome to GovServe</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to access government services
            </p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-4">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground text-center">
                      <strong>Demo Admin:</strong> admin@govserve.com (any password)
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={handleSignup} className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
                    <div className="space-y-2">
                      <Label htmlFor="signup-citizen">National ID</Label>
                      <Input
                        id="signup-citizen"
                        type="number"
                        placeholder="Enter your national ID"
                        value={signupCitizenId}
                        onChange={(e) => setSignupCitizenId(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="signup-firstName">First Name</Label>
                        <Input
                          id="signup-firstName"
                          type="text"
                          placeholder="John"
                          value={signupFirstName}
                          onChange={(e) => setSignupFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-lastName">Last Name</Label>
                        <Input
                          id="signup-lastName"
                          type="text"
                          placeholder="Doe"
                          value={signupLastName}
                          onChange={(e) => setSignupLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-birthDate">Date of Birth</Label>
                      <Input
                        id="signup-birthDate"
                        type="date"
                        value={signupBirthDate}
                        onChange={(e) => setSignupBirthDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-birthPlace">Place of Birth</Label>
                      <Input
                        id="signup-birthPlace"
                        type="text"
                        placeholder="City or town"
                        value={signupBirthPlace}
                        onChange={(e) => setSignupBirthPlace(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-gender">Gender</Label>
                      <select
                        id="signup-gender"
                        value={signupGender}
                        onChange={(e) => setSignupGender(e.target.value as 'MALE' | 'FEMALE' | '')}
                        required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      >
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm Password</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="••••••••"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        required
                      />
                      {signupPassword !== signupConfirmPassword && signupConfirmPassword && (
                        <p className="text-sm text-destructive">Passwords don't match</p>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading || signupPassword !== signupConfirmPassword || !signupGender}
                    >
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
