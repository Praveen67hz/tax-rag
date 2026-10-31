
import { useEffect, useRef } from "react";
import { MessageSquareText, Sparkles } from "lucide-react";
import MessageBubble from "./MessageBubble";

function ChatMessages({ messages, isLoading }) {
  const bottomRef = useRef(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-4xl flex-col px-5 sm:px-8">

        {/* Empty Conversation State */}
        {messages.length === 0 && (
          <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
              <MessageSquareText
                size={30}
                className="text-emerald-600"
              />
            </div>

            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={17} className="text-emerald-500" />

              <span className="text-sm font-semibold text-emerald-700">
                Your AI Tax Assistant
              </span>
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
              How can I help you today?
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-gray-500">
              Ask questions about Indian Income Tax, GST, tax deductions,
              and other tax-related topics. I'll find relevant information
              from your uploaded documents.
            </p>

          </div>
        )}

        {/* Conversation Messages */}
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message.text}
            role={message.role}
          />
        ))}

        {/* AI Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-4 py-6">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700">
              <Sparkles size={18} className="text-white" />
            </div>

            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-gray-100 bg-white px-5 py-4 shadow-sm">
              <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500 [animation-delay:300ms]" />

              <span className="ml-2 text-xs text-gray-500">
                Thinking...
              </span>
            </div>

          </div>
        )}

        {/* Scroll Target */}
        <div ref={bottomRef} />

      </div>
    </div>
  );
}

export default ChatMessages;