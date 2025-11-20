import { useState, useEffect } from "react";
import { MessageCircle, Send, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { auth } from "../lib/firebase";
import { getUserData, UserData } from "../lib/firebaseAuth";
import { 
  getConversationById, 
  sendMessage, 
  MessageDocument,
  ChatMessage 
} from "../lib/firestoreService";
import { toast } from "sonner@2.0.3";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

interface MessagesPageProps {
  onBack?: () => void;
}

interface ConversationWithDetails extends MessageDocument {
  id: string;
  otherUser?: UserData;
}

export function MessagesPage({ onBack }: MessagesPageProps) {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationWithDetails | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);

  // Fetch user's conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const currentUser = auth.currentUser;
        if (!currentUser) {
          toast.error("You must be logged in to view messages");
          return;
        }

        const userData = await getUserData(currentUser.uid);
        if (!userData) {
          toast.error("User data not found");
          return;
        }
        setCurrentUserData(userData);

        const messageIds = userData.messages || [];
        if (messageIds.length === 0) {
          setConversations([]);
          return;
        }

        // Fetch all conversations
        const conversationsData: ConversationWithDetails[] = [];
        for (const messageId of messageIds) {
          const conversation = await getConversationById(messageId);
          if (conversation) {
            // Determine the other user's ID
            const otherUserId = userData.type === "consumer" 
              ? conversation.provider_id 
              : conversation.consumer_id;
            
            // Fetch other user's data
            const otherUserData = await getUserData(otherUserId);
            
            conversationsData.push({
              id: messageId,
              ...conversation,
              otherUser: otherUserData || undefined,
            });
          }
        }

        setConversations(conversationsData);
      } catch (error: any) {
        console.error("Error fetching conversations:", error);
        toast.error("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Real-time listener for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const conversationRef = doc(db, "messages", selectedConversation.id);
    const unsubscribe = onSnapshot(conversationRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as MessageDocument;
        setSelectedConversation(prev => prev ? {
          ...prev,
          chat: data.chat,
          updatedAt: data.updatedAt,
        } : null);
      }
    });

    return () => unsubscribe();
  }, [selectedConversation?.id]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || !currentUserData) return;

    try {
      setSending(true);
      await sendMessage(
        selectedConversation.id,
        messageInput.trim(),
        currentUserData.type
      );
      setMessageInput("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6 flex-shrink-0">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1>Messages</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 flex-shrink-0">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <h1>Messages</h1>
      </div>

      {conversations.length === 0 ? (
        <Card className="flex-1">
          <CardContent className="h-full flex items-center justify-center py-12">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No conversations yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Start a conversation by visiting a provider's profile and clicking "Message"
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden" style={{ gridAutoRows: '1fr' }}>
          {/* Conversations List */}
          <Card className="md:col-span-1 flex flex-col overflow-hidden">
            <CardHeader className="flex-shrink-0">
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-0">
                  {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedConversation?.id === conversation.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage 
                          src={conversation.otherUser?.profilePicture || 
                               `https://api.dicebear.com/7.x/initials/svg?seed=${conversation.otherUser?.name}`} 
                        />
                        <AvatarFallback>
                          {conversation.otherUser?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {conversation.otherUser?.name || "Unknown User"}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.chat.length > 0
                            ? conversation.chat[conversation.chat.length - 1].content
                            : "No messages yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2 flex flex-col overflow-hidden">
            {selectedConversation ? (
              <>
                <CardHeader className="border-b flex-none">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage 
                        src={selectedConversation.otherUser?.profilePicture || 
                             `https://api.dicebear.com/7.x/initials/svg?seed=${selectedConversation.otherUser?.name}`} 
                      />
                      <AvatarFallback>
                        {selectedConversation.otherUser?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">
                        {selectedConversation.otherUser?.name || "Unknown User"}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {selectedConversation.otherUser?.type === "provider" 
                          ? "Provider" 
                          : "Consumer"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-1 flex flex-col overflow-hidden">
                  <ScrollArea className="flex-1 mb-4 pr-4 w-full">
                    <div className="w-full">
                      {selectedConversation.chat.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        <div className="space-y-4 py-2 w-full">
                          {selectedConversation.chat.map((message: ChatMessage, index: number) => {
                            const currentUserId = auth.currentUser?.uid;
                            // Determine if this message is from the current user
                            // Check if message user_type matches current user type AND user IDs match
                            let isCurrentUser = false;
                            
                            // Debug logging
                            console.log("=== Message Debug ===");
                            console.log("Message index:", index);
                            console.log("Message content:", message.content);
                            console.log("Message user_type:", message.user_type);
                            console.log("Current user ID:", currentUserId);
                            console.log("Current user data:", currentUserData);
                            console.log("Current user type:", currentUserData?.type);
                            console.log("Conversation consumer_id:", selectedConversation.consumer_id);
                            console.log("Conversation provider_id:", selectedConversation.provider_id);
                            
                            if (currentUserId && currentUserData) {
                              if (message.user_type === "consumer") {
                                isCurrentUser = currentUserId === selectedConversation.consumer_id;
                                console.log(`Consumer message check: ${currentUserId} === ${selectedConversation.consumer_id} = ${isCurrentUser}`);
                              } else if (message.user_type === "provider") {
                                isCurrentUser = currentUserId === selectedConversation.provider_id;
                                console.log(`Provider message check: ${currentUserId} === ${selectedConversation.provider_id} = ${isCurrentUser}`);
                              }
                            } else {
                              console.log("Missing currentUserId or currentUserData");
                            }
                            
                            console.log("Final isCurrentUser:", isCurrentUser);
                            console.log("Will align:", isCurrentUser ? "RIGHT (justify-end)" : "LEFT (justify-start)");
                            const containerClassName = `flex w-full ${isCurrentUser ? "justify-end" : "justify-start"}`;
                            const bubbleClassName = `max-w-[70%] rounded-lg px-4 py-2 ${
                              isCurrentUser
                                ? "bg-primary text-primary-foreground ml-auto"
                                : "bg-muted"
                            }`;
                            console.log("Container className:", containerClassName);
                            console.log("Bubble className:", bubbleClassName);
                            console.log("===================");
                            
                            return (
                              <div
                                key={index}
                                className={containerClassName}
                                style={{ width: '100%', display: 'flex' }}
                              >
                                <div
                                  className={bubbleClassName}
                                  style={isCurrentUser ? { marginLeft: 'auto', display: 'block' } : { display: 'block' }}
                                >
                                  <p className="text-sm">{message.content}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="flex gap-2 flex-none">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !sending) {
                          handleSendMessage();
                        }
                      }}
                      disabled={sending}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!messageInput.trim() || sending}
                      size="icon"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Select a conversation to start messaging
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

