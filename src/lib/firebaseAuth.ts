import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { auth, db, storage } from "./firebase";

export interface UserData {
  id: string;
  email: string;
  name: string;
  type: "consumer" | "provider";
  isOnboarded: boolean;
  profile_picture?: string; // URL to the user's profile picture
  followed?: string[]; // Array of provider_ids the user follows
  my_posts?: string[]; // Array of post document IDs that belong to this user
  services?: string[]; // Array of service document IDs that belong to this provider
  bookings?: string[]; // Array of booking document IDs for this user
  messages?: string[]; // Array of message document IDs for conversations
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
      services: [], // Initialize empty services array for providers
      bookings: [], // Initialize empty bookings array
      messages: [], // Initialize empty messages array
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
      console.error("User document not found in Firestore for:", userCredential.user.uid);
      throw new Error("User data not found. Please contact support.");
    }

    const userData = userDoc.data() as UserData;
    
    // Ensure userData has all required fields
    if (!userData.id || !userData.email || !userData.name || !userData.type) {
      console.error("Invalid user data structure:", userData);
      throw new Error("Invalid user data. Please contact support.");
    }
    
    return userData;
  } catch (error: any) {
    console.error("Sign in error:", error);
    // Provide more specific error messages
    if (error.code === "auth/user-not-found") {
      throw new Error("No account found with this email address.");
    } else if (error.code === "auth/wrong-password") {
      throw new Error("Incorrect password. Please try again.");
    } else if (error.code === "auth/invalid-email") {
      throw new Error("Invalid email address.");
    } else if (error.code === "auth/user-disabled") {
      throw new Error("This account has been disabled.");
    } else if (error.message) {
      throw new Error(error.message);
    }
    throw new Error("Failed to sign in. Please try again.");
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
      const userData = userDoc.data() as UserData;
      
      // If profile_picture is missing from user document, check the collection
      // This is completely non-blocking - we check asynchronously without awaiting
      if (!userData.profile_picture) {
        // Don't await this - let it run in the background
        getProfilePictureFromCollection(userId)
          .then((profilePictureUrl) => {
            if (profilePictureUrl) {
              // Update user document with the profile picture URL
              updateUserData(userId, { profile_picture: profilePictureUrl }).catch((error) => {
                console.warn("Failed to update user document with profile picture:", error);
              });
            }
          })
          .catch((error) => {
            // Silently fail - don't block sign-in flow
            console.warn("Failed to get profile picture from collection:", error);
          });
      }
      
      return userData;
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

/**
 * Check if URL is too long for Firestore (limit is ~1MB, but we use 500KB to be safe)
 */
const FIRESTORE_MAX_FIELD_SIZE = 500 * 1024; // 500KB in bytes - more conservative limit

function isUrlTooLong(url: string): boolean {
  // Firestore has a 1MB limit per field, but we check at 500KB to be safe
  // We check the byte length, not character length (data URLs are base64 encoded)
  const byteLength = new Blob([url]).size;
  return byteLength > FIRESTORE_MAX_FIELD_SIZE;
}

/**
 * Compress data URL image by resizing it (more aggressive compression)
 */
function compressDataUrl(dataUrl: string, maxWidth: number = 600, quality: number = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Calculate new dimensions
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      // Create canvas and draw resized image
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      
      // Use better image smoothing for quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to compressed data URL
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve(compressedDataUrl);
    };
    
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}

/**
 * Upload data URL to Firebase Storage and return download URL
 */
async function uploadDataUrlToStorage(userId: string, dataUrl: string): Promise<string> {
  try {
    // Delete old profile picture from Storage if it exists
    try {
      const oldStoragePath = `profile_pictures/${userId}_profile.jpg`;
      const oldRef = ref(storage, oldStoragePath);
      await deleteObject(oldRef);
    } catch (error) {
      // Ignore if old file doesn't exist
      console.log("No old profile picture to delete from Storage");
    }
    
    // Upload new profile picture
    const fileName = `profile_pictures/${userId}_profile_${Date.now()}.jpg`;
    const storageRef = ref(storage, fileName);
    
    await uploadString(storageRef, dataUrl, "data_url");
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error: any) {
    throw new Error(error.message || "Failed to upload profile picture to storage");
  }
}

/**
 * Validate profile picture URL (basic validation, non-blocking)
 */
export async function validateProfilePictureUrl(url: string): Promise<boolean> {
  try {
    // Basic URL validation
    new URL(url);
    
    // For data URLs (base64), they're always valid
    if (url.startsWith("data:image/")) {
      return true;
    }
    
    // For regular URLs, try to load the image to verify it's accessible
    // This is non-blocking and won't prevent saving if it fails
    return new Promise((resolve) => {
      const img = new Image();
      let resolved = false;
      
      const cleanup = () => {
        if (!resolved) {
          resolved = true;
          // Default to true - let the user save it even if we can't validate
          // The error will show in the UI if the image doesn't load
          resolve(true);
        }
      };
      
      img.onload = () => {
        if (!resolved) {
          resolved = true;
          resolve(true);
        }
      };
      
      img.onerror = () => {
        // Still return true - let the user save it even if we can't validate
        // The error will show in the UI if the image doesn't load
        cleanup();
      };
      
      img.src = url;
      
      // Timeout after 2 seconds - if it takes longer, assume it's valid
      setTimeout(cleanup, 2000);
    });
  } catch {
    return false;
  }
}

/**
 * Save profile picture URL to profile_picture collection under users
 * This replaces the previous profile picture with the new one (most recent wins)
 * Each save includes a timestamp of when the new URL was inserted
 */
export async function saveProfilePictureToCollection(
  userId: string,
  profilePictureUrl: string
): Promise<void> {
  try {
    // Save to users/{userId}/profile_picture/current document
    // Using merge: true means this replaces/updates the existing document
    // The updatedAt timestamp tracks when this new URL was inserted
    await setDoc(
      doc(db, "users", userId, "profile_picture", "current"),
      {
        url: profilePictureUrl,
        updatedAt: serverTimestamp(), // Timestamp of when this new URL was inserted
      },
      { merge: true } // Replaces the old profile_picture with the new one
    );
  } catch (error: any) {
    throw new Error(error.message || "Failed to save profile picture to collection");
  }
}

/**
 * Get profile picture URL from profile_picture collection (always returns the most recent)
 */
export async function getProfilePictureFromCollection(
  userId: string
): Promise<string | null> {
  try {
    const profilePictureDoc = await getDoc(
      doc(db, "users", userId, "profile_picture", "current")
    );
    
    if (profilePictureDoc.exists()) {
      const data = profilePictureDoc.data();
      // Return the URL with timestamp info (always the most recent since we replace the document)
      return data.url || null;
    }
    
    return null;
  } catch (error: any) {
    console.error("Error getting profile picture from collection:", error);
    return null;
  }
}

/**
 * Process profile picture URL - handle long URLs by compressing or uploading to Storage
 */
async function processProfilePictureUrl(userId: string, url: string): Promise<string> {
  // If it's a data URL (from image editor), always compress and upload to Storage
  // Data URLs are almost always too long for Firestore, so we always use Storage
  if (url.startsWith("data:image/")) {
    try {
      // Always compress data URLs first to reduce upload size and improve performance
      console.log("Compressing and uploading profile picture to Firebase Storage...");
      const compressedUrl = await compressDataUrl(url, 600, 0.75);
      
      // Upload compressed version to Firebase Storage
      const storageUrl = await uploadDataUrlToStorage(userId, compressedUrl);
      return storageUrl;
    } catch (error: any) {
      // If compression fails, try uploading original to Storage
      console.log("Compression failed, uploading original to Firebase Storage...");
      try {
        const storageUrl = await uploadDataUrlToStorage(userId, url);
        return storageUrl;
      } catch (uploadError: any) {
        throw new Error("Failed to upload profile picture. Please try again or use a different image.");
      }
    }
  }
  
  // If it's a regular HTTP/HTTPS URL, check length
  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Regular URLs are usually short, but check anyway
    if (isUrlTooLong(url)) {
      // If URL string itself is too long, we can't do much except suggest using Storage
      // For now, we'll try to fetch the image and upload it to Storage
      try {
        console.log("URL string is too long, fetching image and uploading to Storage...");
        const response = await fetch(url);
        const blob = await response.blob();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        
        // Compress and upload
        const compressedUrl = await compressDataUrl(dataUrl, 600, 0.75);
        const storageUrl = await uploadDataUrlToStorage(userId, compressedUrl);
        return storageUrl;
      } catch (error: any) {
        throw new Error("Image URL is too long. Please use a shorter URL or upload the image directly.");
      }
    }
    return url;
  }
  
  // For other URL types, use as-is (shouldn't happen, but be safe)
  return url;
}

/**
 * Update user profile (name and optionally profile picture URL)
 * Simple version - just saves the URL string directly
 */
export async function updateUserProfile(
  userId: string,
  name: string,
  profilePictureUrl?: string
): Promise<void> {
  try {
    const trimmedUrl = profilePictureUrl?.trim();
    
    // Save to profile_picture collection (replaces previous) if URL provided
    if (trimmedUrl) {
      await saveProfilePictureToCollection(userId, trimmedUrl);
    }

    // Update user document with name and profile picture URL
    await updateUserData(userId, {
      name,
      ...(trimmedUrl && { profile_picture: trimmedUrl }),
    });

    // Update Firebase Auth profile
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      await updateProfile(firebaseUser, {
        displayName: name,
        ...(trimmedUrl && { photoURL: trimmedUrl }),
      });
    }
  } catch (error: any) {
    throw new Error(error.message || "Failed to update profile");
  }
}

