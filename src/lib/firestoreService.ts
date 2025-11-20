import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  query,
  orderBy,
  limit,
  Timestamp,
  addDoc,
  arrayUnion,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebase";
import { WorkPhoto } from "../components/mockData";
import { auth } from "./firebase";

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
export async function getForYouPosts(followedProviderIds: string[]): Promise<WorkPhoto[]> {
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
      // Only include posts from followed providers (by provider_id)
      const providerId = data.provider_id || "";
      if (followedProviderIds.includes(providerId)) {
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

/**
 * Create a new post in the explore collection
 */
export async function createPost(
  imageUrl: string,
  description: string,
  category: string,
  userId: string,
  userName: string,
  userProfilePicture?: string
): Promise<string> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be authenticated to create a post");
    }

    const exploreRef = collection(db, "explore");
    const newPost: ExploreDocument = {
      url: imageUrl,
      description: description,
      category: category,
      provider_name: userName,
      provider_id: userId,
      profile_picture: userProfilePicture || "",
      likes: 0,
      verified: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(exploreRef, newPost);
    return docRef.id;
  } catch (error: any) {
    console.error("Error creating post:", error);
    throw new Error(error.message || "Failed to create post");
  }
}

/**
 * Add a post ID to the user's my_posts array
 */
export async function addPostToUser(userId: string, postId: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      my_posts: arrayUnion(postId),
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    console.error("Error adding post to user:", error);
    throw new Error(error.message || "Failed to add post to user");
  }
}

/**
 * Service document interface
 */
export interface ServiceDocument {
  id?: string; // Document ID
  title: string;
  price: number;
  time: number; // duration in minutes
  provider_id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Create a new service in the services collection
 */
export async function createService(
  title: string,
  price: number,
  time: number,
  userId: string
): Promise<string> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be authenticated to create a service");
    }

    const servicesRef = collection(db, "services");
    const newService: ServiceDocument = {
      title,
      price,
      time,
      provider_id: userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(servicesRef, newService);
    return docRef.id;
  } catch (error: any) {
    console.error("Error creating service:", error);
    throw new Error(error.message || "Failed to create service");
  }
}

/**
 * Add a service ID to the user's services array
 */
export async function addServiceToUser(userId: string, serviceId: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      services: arrayUnion(serviceId),
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    console.error("Error adding service to user:", error);
    throw new Error(error.message || "Failed to add service to user");
  }
}

/**
 * Fetch services by IDs
 */
export async function getServicesByIds(serviceIds: string[]): Promise<ServiceDocument[]> {
  try {
    if (serviceIds.length === 0) return [];

    const services: ServiceDocument[] = [];
    
    for (const serviceId of serviceIds) {
      const serviceRef = doc(db, "services", serviceId);
      const serviceSnap = await getDoc(serviceRef);
      
      if (serviceSnap.exists()) {
        services.push({ 
          id: serviceSnap.id, 
          ...serviceSnap.data() as ServiceDocument 
        });
      }
    }
    
    return services;
  } catch (error: any) {
    console.error("Error fetching services:", error);
    throw new Error(error.message || "Failed to fetch services");
  }
}

/**
 * Booking document interface
 */
export interface BookingDocument {
  time: Timestamp;
  service_id: string;
  user_id: string;
  provider_id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Create a new booking in the bookings collection
 */
export async function createBooking(
  serviceId: string,
  userId: string,
  providerId: string,
  bookingTime: Date
): Promise<string> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be authenticated to create a booking");
    }

    const bookingsRef = collection(db, "bookings");
    const newBooking: BookingDocument = {
      time: Timestamp.fromDate(bookingTime),
      service_id: serviceId,
      user_id: userId,
      provider_id: providerId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(bookingsRef, newBooking);
    return docRef.id;
  } catch (error: any) {
    console.error("Error creating booking:", error);
    throw new Error(error.message || "Failed to create booking");
  }
}

/**
 * Add a booking ID to the user's bookings array
 */
export async function addBookingToUser(userId: string, bookingId: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      bookings: arrayUnion(bookingId),
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    console.error("Error adding booking to user:", error);
    throw new Error(error.message || "Failed to add booking to user");
  }
}

/**
 * Fetch bookings by user ID
 */
export async function getBookingsByUserId(userId: string): Promise<(BookingDocument & { id: string })[]> {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, orderBy("time", "desc"));
    const querySnapshot = await getDocs(q);
    
    const bookings: (BookingDocument & { id: string })[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as BookingDocument;
      if (data.user_id === userId) {
        bookings.push({ id: doc.id, ...data });
      }
    });
    
    return bookings;
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    throw new Error(error.message || "Failed to fetch bookings");
  }
}

/**
 * Fetch bookings by IDs
 */
export async function getBookingsByIds(bookingIds: string[]): Promise<(BookingDocument & { id: string })[]> {
  try {
    if (bookingIds.length === 0) return [];

    const bookings: (BookingDocument & { id: string })[] = [];
    
    for (const bookingId of bookingIds) {
      const bookingRef = doc(db, "bookings", bookingId);
      const bookingSnap = await getDoc(bookingRef);
      
      if (bookingSnap.exists()) {
        bookings.push({ id: bookingSnap.id, ...bookingSnap.data() as BookingDocument });
      }
    }
    
    // Sort by time (most recent first)
    bookings.sort((a, b) => b.time.toMillis() - a.time.toMillis());
    
    return bookings;
  } catch (error: any) {
    console.error("Error fetching bookings by IDs:", error);
    throw new Error(error.message || "Failed to fetch bookings");
  }
}

/**
 * Message document interface
 */
export interface MessageDocument {
  consumer_id: string;
  provider_id: string;
  chat: ChatMessage[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ChatMessage {
  content: string;
  user_type: "consumer" | "provider";
  timestamp?: Timestamp;
}

/**
 * Create a new message conversation between consumer and provider
 */
export async function createMessageConversation(
  consumerId: string,
  providerId: string
): Promise<string> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be authenticated to start a conversation");
    }

    // Check if conversation already exists
    const existingConversation = await findExistingConversation(consumerId, providerId);
    if (existingConversation) {
      return existingConversation;
    }

    // Create new conversation
    const messagesRef = collection(db, "messages");
    const newConversation: MessageDocument = {
      consumer_id: consumerId,
      provider_id: providerId,
      chat: [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(messagesRef, newConversation);
    const conversationId = docRef.id;

    // Add conversation ID to both users' messages arrays
    await addMessageToUser(consumerId, conversationId);
    await addMessageToUser(providerId, conversationId);

    return conversationId;
  } catch (error: any) {
    console.error("Error creating conversation:", error);
    throw new Error(error.message || "Failed to create conversation");
  }
}

/**
 * Find existing conversation between consumer and provider
 */
async function findExistingConversation(
  consumerId: string,
  providerId: string
): Promise<string | null> {
  try {
    const messagesRef = collection(db, "messages");
    const querySnapshot = await getDocs(messagesRef);
    
    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data() as MessageDocument;
      if (data.consumer_id === consumerId && data.provider_id === providerId) {
        return docSnap.id;
      }
    }
    
    return null;
  } catch (error: any) {
    console.error("Error finding existing conversation:", error);
    return null;
  }
}

/**
 * Add a message conversation ID to the user's messages array
 */
export async function addMessageToUser(userId: string, messageId: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      messages: arrayUnion(messageId),
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    console.error("Error adding message to user:", error);
    throw new Error(error.message || "Failed to add message to user");
  }
}

/**
 * Send a message in an existing conversation
 */
export async function sendMessage(
  conversationId: string,
  content: string,
  userType: "consumer" | "provider"
): Promise<void> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("User must be authenticated to send a message");
    }

    const conversationRef = doc(db, "messages", conversationId);
    const newMessage: ChatMessage = {
      content,
      user_type: userType,
      timestamp: Timestamp.now(),
    };

    await updateDoc(conversationRef, {
      chat: arrayUnion(newMessage),
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    console.error("Error sending message:", error);
    throw new Error(error.message || "Failed to send message");
  }
}

/**
 * Fetch a conversation by ID
 */
export async function getConversationById(conversationId: string): Promise<MessageDocument | null> {
  try {
    const conversationRef = doc(db, "messages", conversationId);
    const conversationSnap = await getDoc(conversationRef);
    
    if (conversationSnap.exists()) {
      return conversationSnap.data() as MessageDocument;
    }
    
    return null;
  } catch (error: any) {
    console.error("Error fetching conversation:", error);
    throw new Error(error.message || "Failed to fetch conversation");
  }
}

