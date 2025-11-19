import { useState } from "react";
import { WelcomePage } from "./WelcomePage";
import { LoginPage } from "./LoginPage";
import { SignupPage } from "./SignupPage";
import { ConsumerOnboarding } from "./ConsumerOnboarding";
import { ProviderOnboarding } from "./ProviderOnboarding";

type AuthFlow = "welcome" | "login" | "signup" | "consumer-onboarding" | "provider-onboarding";
type UserType = "consumer" | "provider";

interface User {
  id: string;
  email: string;
  name: string;
  type: UserType;
  isOnboarded: boolean;
}

interface AuthWrapperProps {
  onAuthComplete: (user: User) => void;
  onGuestMode?: () => void;
}

export function AuthWrapper({ onAuthComplete, onGuestMode }: AuthWrapperProps) {
  const [currentFlow, setCurrentFlow] = useState<AuthFlow>("welcome");
  const [userType, setUserType] = useState<UserType | null>(null);
  const [pendingUser, setPendingUser] = useState<Partial<User> | null>(null);

  const handleWelcomeChoice = (type: UserType) => {
    setUserType(type);
    setCurrentFlow("signup");
  };

  const handleSignupComplete = (userData: Partial<User>) => {
    setPendingUser(userData);
    if (userData.type === "consumer") {
      setCurrentFlow("consumer-onboarding");
    } else {
      setCurrentFlow("provider-onboarding");
    }
  };

  const handleOnboardingComplete = (onboardingData: any) => {
    if (pendingUser) {
      const completeUser: User = {
        ...pendingUser,
        isOnboarded: true,
        ...onboardingData
      } as User;
      onAuthComplete(completeUser);
    }
  };

  const handleLogin = (userData: User) => {
    if (!userData.isOnboarded) {
      setPendingUser(userData);
      if (userData.type === "consumer") {
        setCurrentFlow("consumer-onboarding");
      } else {
        setCurrentFlow("provider-onboarding");
      }
    } else {
      onAuthComplete(userData);
    }
  };

  switch (currentFlow) {
    case "welcome":
      return (
        <WelcomePage 
          onChooseUserType={handleWelcomeChoice}
          onLogin={() => setCurrentFlow("login")}
          onGuestMode={onGuestMode}
        />
      );
    case "login":
      return (
        <LoginPage 
          onLogin={handleLogin}
          onBack={() => setCurrentFlow("welcome")}
          onSignup={() => setCurrentFlow("welcome")}
        />
      );
    case "signup":
      return (
        <SignupPage 
          userType={userType!}
          onSignupComplete={handleSignupComplete}
          onBack={() => setCurrentFlow("welcome")}
          onLogin={() => setCurrentFlow("login")}
        />
      );
    case "consumer-onboarding":
      return (
        <ConsumerOnboarding 
          onComplete={handleOnboardingComplete}
        />
      );
    case "provider-onboarding":
      return (
        <ProviderOnboarding 
          onComplete={handleOnboardingComplete}
        />
      );
    default:
      return <WelcomePage onChooseUserType={handleWelcomeChoice} onLogin={() => setCurrentFlow("login")} />;
  }
}