import { useState } from "react";
import { WelcomePage } from "./WelcomePage";
import { LoginPage } from "./LoginPage";
import { SignupPage } from "./SignupPage";
import { ConsumerOnboarding } from "./ConsumerOnboarding";
import { ProviderOnboarding } from "./ProviderOnboarding";
import { updateUserData } from "../../lib/firebaseAuth";

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

  const handleOnboardingComplete = async (onboardingData: any) => {
    if (pendingUser && pendingUser.id) {
      try {
        // Update user data in Firestore with onboarding information
        await updateUserData(pendingUser.id, {
          isOnboarded: true,
          ...onboardingData
        });

        const completeUser: User = {
          ...pendingUser,
          isOnboarded: true,
          ...onboardingData
        } as User;
        onAuthComplete(completeUser);
      } catch (error: any) {
        console.error("Error updating user data:", error);
        // Still complete onboarding even if Firestore update fails
        const completeUser: User = {
          ...pendingUser,
          isOnboarded: true,
          ...onboardingData
        } as User;
        onAuthComplete(completeUser);
      }
    }
  };

  const handleLogin = (userData: User) => {
    try {
      if (!userData || !userData.id) {
        console.error("Invalid user data received:", userData);
        return;
      }
      
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
    } catch (error) {
      console.error("Error handling login:", error);
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