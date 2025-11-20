import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface UserData {
  id: string;
  email: string;
  name: string;
  type: "consumer" | "provider";
  isOnboarded: boolean;
  followed?: string[]; // Array of provider_ids the user follows
  my_posts?: string[]; // Array of post document IDs that belong to this user
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  name: string,
  userType: "consumer" | "provider"
): Promise<UserData> {
  try {
    // Create user in Firebase Auth
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Update user profile with display name
    await updateProfile(userCredential.user, {
      displayName: name,
    });

    // Create user document in Firestore
    const userData: UserData = {
      id: userCredential.user.uid,
      email: userCredential.user.email || email,
      name,
      type: userType,
      isOnboarded: false,
      followed: [], // Initialize empty followed array
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", userCredential.user.uid), userData);

    return userData;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create account");
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(
  email: string,
  password: string
): Promise<UserData> {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

    if (!userDoc.exists()) {
      throw new Error("User data not found");
    }

    const userData = userDoc.data() as UserData;
    return userData;
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign in");
  }
}

/**
 * Sign out the current user
 */
export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || "Failed to sign out");
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || "Failed to send password reset email");
  }
}

/**
 * Update user profile data in Firestore
 */
export async function updateUserData(
  userId: string,
  data: Partial<UserData>
): Promise<void> {
  try {
    await setDoc(
      doc(db, "users", userId),
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error: any) {
    throw new Error(error.message || "Failed to update user data");
  }
}

/**
 * Get user data from Firestore
 */
export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || "Failed to get user data");
  }
}

/**
 * Convert Firebase User to UserData
 */
export function firebaseUserToUserData(
  firebaseUser: FirebaseUser
): Partial<UserData> {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    name: firebaseUser.displayName || "",
  };
}

/**
 * Follow a provider by provider_id
 */
export async function followProvider(
  userId: string,
  providerId: string
): Promise<void> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data() as UserData;
    const followed = userData.followed || [];
    
    if (!followed.includes(providerId)) {
      await updateUserData(userId, {
        followed: [...followed, providerId],
      });
    }
  } catch (error: any) {
    throw new Error(error.message || "Failed to follow provider");
  }
}

/**
 * Unfollow a provider by provider_id
 */
export async function unfollowProvider(
  userId: string,
  providerId: string
): Promise<void> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data() as UserData;
    const followed = userData.followed || [];
    
    await updateUserData(userId, {
      followed: followed.filter((id) => id !== providerId),
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to unfollow provider");
  }
}

