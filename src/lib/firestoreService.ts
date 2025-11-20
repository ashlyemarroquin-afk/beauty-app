import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  query,
  orderBy,
  limit,
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { WorkPhoto } from "../components/mockData";

/**
 * Firestore document structure for explore/foryou collections
 */
export interface ExploreDocument {
  description?: string;
  location?: string;
  profile_picture?: string;
  provider_name?: string;
  rating?: number;
  url?: string;
  verified?: boolean;
  category?: string;
  likes?: number;
  provider_id?: string;
  profession?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Convert Firestore document to WorkPhoto interface
 */
function mapFirestoreToWorkPhoto(docId: string, data: ExploreDocument): WorkPhoto {
  return {
    id: docId,
    image: data.url || "",
    category: data.category || "General",
    professional: {
      id: data.provider_id || data.provider_name?.toLowerCase().replace(/\s+/g, "-") || docId,
      name: data.provider_name || "Unknown Provider",
      avatar: data.profile_picture || "",
      profession: data.profession,
      verified: data.verified || false,
      rating: data.rating,
      location: data.location,
    },
    likes: data.likes || 0,
    description: data.description,
  };
}

/**
 * Fetch all documents from the explore collection
 */
export async function getExplorePosts(): Promise<WorkPhoto[]> {
  try {
    console.log("=== Fetching posts from 'explore' collection ===");
    console.log("Firestore db instance:", db);
    console.log("Firestore app:", db.app);
    
    const exploreRef = collection(db, "explore");
    console.log("Collection reference created:", exploreRef);
    
    // First, try to get all documents without orderBy to see if collection has data
    let querySnapshot = await getDocs(exploreRef);
    console.log(`📊 Found ${querySnapshot.size} documents in explore collection (without orderBy)`);
    
    if (querySnapshot.empty) {
      console.warn("⚠ Collection appears to be empty! Check:");
      console.warn("1. Collection name is exactly 'explore' (case-sensitive)");
      console.warn("2. Firestore security rules allow read access");
      console.warn("3. Documents actually exist in the collection");
      console.warn("4. You're looking at the correct Firebase project");
      return [];
    }
    
    // If we have documents, try to re-fetch with orderBy if createdAt exists
    // Check if any document has createdAt field
    const hasCreatedAt = querySnapshot.docs.some(doc => doc.data().createdAt);
    
    if (hasCreatedAt) {
      try {
        const q = query(exploreRef, orderBy("createdAt", "desc"));
        querySnapshot = await getDocs(q);
        console.log("✓ Re-fetched with orderBy createdAt (sorted by newest first)");
      } catch (orderError: any) {
        console.log("⚠ OrderBy failed, using unsorted results:", orderError.message);
        // Keep the original querySnapshot
      }
    } else {
      console.log("ℹ Documents don't have 'createdAt' field, using unsorted results");
    }
    
    console.log(`📊 Processing ${querySnapshot.size} documents`);
    
    const posts: WorkPhoto[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as ExploreDocument;
      console.log(`📄 Processing document ${doc.id}:`, {
        provider_name: data.provider_name,
        url: data.url ? "✓" : "✗ MISSING",
        category: data.category || "General (default)",
        hasDescription: !!data.description
      });
      
      // Validate required fields
      if (!data.url) {
        console.warn(`⚠ Document ${doc.id} is missing 'url' field - skipping`);
        return;
      }
      
      if (!data.provider_name) {
        console.warn(`⚠ Document ${doc.id} is missing 'provider_name' field - using default`);
      }
      
      const mappedPost = mapFirestoreToWorkPhoto(doc.id, data);
      posts.push(mappedPost);
    });
    
    console.log(`✅ Successfully mapped ${posts.length} posts`);
    console.log("=== Fetch complete ===");
    return posts;
  } catch (error: any) {
    console.error("❌ Error fetching explore posts:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Provide helpful error messages
    if (error.code === "permission-denied") {
      throw new Error("Permission denied. Please check your Firestore security rules allow read access to the 'explore' collection.");
    } else if (error.code === "not-found") {
      throw new Error("Collection 'explore' not found. Please check the collection name in Firestore.");
    } else {
      throw new Error(`Failed to fetch posts: ${error.message || "Unknown error"}`);
    }
  }
}

/**
 * Fetch posts from followed providers only (for ForYou page)
 */
export async function getForYouPosts(followedProviders: string[]): Promise<WorkPhoto[]> {
  try {
    const exploreRef = collection(db, "explore");
    let querySnapshot;
    try {
      const q = query(exploreRef, orderBy("createdAt", "desc"));
      querySnapshot = await getDocs(q);
    } catch (orderError) {
      querySnapshot = await getDocs(exploreRef);
    }
    
    const posts: WorkPhoto[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as ExploreDocument;
      // Only include posts from followed providers
      if (followedProviders.includes(data.provider_name || "")) {
        posts.push(mapFirestoreToWorkPhoto(doc.id, data));
      }
    });
    
    return posts;
  } catch (error) {
    console.error("Error fetching foryou posts:", error);
    throw new Error("Failed to fetch posts from Firestore");
  }
}

/**
 * Fetch a single document from the explore collection
 */
export async function getExplorePost(postId: string): Promise<WorkPhoto | null> {
  try {
    const docRef = doc(db, "explore", postId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as ExploreDocument;
      return mapFirestoreToWorkPhoto(docSnap.id, data);
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error("Failed to fetch post from Firestore");
  }
}

/**
 * Fetch posts by category from explore collection
 */
export async function getExplorePostsByCategory(category: string): Promise<WorkPhoto[]> {
  try {
    const exploreRef = collection(db, "explore");
    const querySnapshot = await getDocs(exploreRef);
    
    const posts: WorkPhoto[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as ExploreDocument;
      if (data.category === category || category === "All") {
        posts.push(mapFirestoreToWorkPhoto(doc.id, data));
      }
    });
    
    return posts;
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    throw new Error("Failed to fetch posts from Firestore");
  }
}

