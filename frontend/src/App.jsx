
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { askQuestion, uploadDocument } from "./services/api";

function App() {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Document upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  // New Chat reset trigger
  const [chatResetKey, setChatResetKey] = useState(0);

  // Start a new chat
  const handleNewChat = () => {
    if (isLoading || isUploading) return;

    setMessages([]);
    setSelectedFile(null);
    setUploadStatus(null);
    setActiveConversationId(null);

    // Trigger ChatInput reset
    setChatResetKey((previous) => previous + 1);
  };

  const handleSelectConversation = (conversationId) => {
    const conversation = conversations.find(
      (item) => item.id === conversationId
    );

    if (!conversation || isLoading || isUploading) return;

    setActiveConversationId(conversation.id);
    setMessages(conversation.messages);
  }; 


  // Send chat message
  const handleSendMessage = async (question) => {
    const userMessage = {
      id: Date.now(),
      role: "user",
      text: question,
    };

    let conversationId = activeConversationId;

    // Create a new conversation if there is no active conversation
    if (!conversationId) {
      conversationId = Date.now();

      setActiveConversationId(conversationId);

      setConversations((previousConversations) => [
        ...previousConversations,
        {
          id: conversationId,
          title: question,
          messages: [],
        },
      ]);
    }

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setIsLoading(true);

    try {
      const answer = await askQuestion(question, messages);

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: answer,
      };

      setConversations((previousConversations) =>
        previousConversations.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: [
                  ...conversation.messages,
                  userMessage,
                  assistantMessage,
                ],
              }
            : conversation
        )
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: "Sorry, I couldn't generate a response. Please check whether the backend is running and try again.",
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        errorMessage,
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  // Upload document
  const handleUploadDocument = async () => {
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const result = await uploadDocument(selectedFile);

      setUploadStatus({
        type: "success",
        message: `${result.filename} uploaded successfully. ${result.chunks_inserted} chunks added to your knowledge base.`,
      });

      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);

      setUploadStatus({
        type: "error",
        message: error.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onNewChat={handleNewChat}
        onClose={() => setIsSidebarOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          onMenuClick={() =>
            setIsSidebarOpen((previous) => !previous)
          }
        />

        <ChatMessages
          messages={messages}
          isLoading={isLoading}
        />

        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          chatResetKey={chatResetKey}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          isUploading={isUploading}
          onUpload={handleUploadDocument}
          uploadStatus={uploadStatus}
          setUploadStatus={setUploadStatus}
        />
      </main>
    </div>
  );
}

export default App;