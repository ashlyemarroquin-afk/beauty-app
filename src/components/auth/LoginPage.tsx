import { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader } from "../ui/card";
import { toast } from "sonner@2.0.3";
import { signIn, resetPassword } from "../../lib/firebaseAuth";

interface LoginPageProps {
  onLogin: (user: any) => void;
  onBack: () => void;
  onSignup: () => void;
}

export function LoginPage({ onLogin, onBack, onSignup }: LoginPageProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userData = await signIn(formData.email, formData.password);
      toast.success("Welcome back!");
      onLogin(userData);
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error("Please enter your email address first");
      return;
    }

    try {
      await resetPassword(formData.email);
      setResetEmailSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send password reset email");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>
        </div>

        <Card>
          <CardHeader className="space-y-1 pb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold">S</span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Forgot Password */}
            <div className="mt-4 text-center">
              {!resetEmailSent ? (
                <Button 
                  variant="link" 
                  className="text-sm"
                  onClick={handleForgotPassword}
                  disabled={!formData.email}
                >
                  Forgot your password?
                </Button>
              ) : (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Password reset email sent! Check your inbox.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" className="p-0" onClick={onSignup}>
              Sign up
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}