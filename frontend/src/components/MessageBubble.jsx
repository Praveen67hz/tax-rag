
import { Bot, User, Copy, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

function MessageBubble({ message, role }) {
  const [copied, setCopied] = useState(false);

  const isUser = role === "user";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  return (
    <div
      className={`group flex w-full gap-4 py-6 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-md shadow-emerald-900/10">
          <Bot size={19} className="text-white" />
        </div>
      )}

      {/* Message Content */}
      <div
        className={`flex max-w-[85%] flex-col gap-2 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        {/* Sender Name */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs font-semibold text-gray-700">
            {isUser ? "You" : "Tax Assistant"}
          </span>

          {!isUser && (
            <Sparkles size={13} className="text-emerald-500" />
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-5 py-3.5 text-sm leading-7 ${
            isUser
              ? "rounded-tr-sm bg-emerald-600 text-white shadow-lg shadow-emerald-900/10"
              : "rounded-tl-sm border border-gray-100 bg-white text-gray-700 shadow-sm"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">
              {message}
            </p>
          ) : (
            <div className="break-words">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-3 last:mb-0">
                      {children}
                    </p>
                  ),

                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),

                  ul: ({ children }) => (
                    <ul className="my-3 list-disc space-y-1 pl-6">
                      {children}
                    </ul>
                  ),

                  ol: ({ children }) => (
                    <ol className="my-3 list-decimal space-y-1 pl-6">
                      {children}
                    </ol>
                  ),

                  li: ({ children }) => (
                    <li className="pl-1">
                      {children}
                    </li>
                  ),

                  h1: ({ children }) => (
                    <h1 className="mb-3 mt-4 text-lg font-bold text-gray-900">
                      {children}
                    </h1>
                  ),

                  h2: ({ children }) => (
                    <h2 className="mb-2 mt-4 text-base font-bold text-gray-900">
                      {children}
                    </h2>
                  ),

                  h3: ({ children }) => (
                    <h3 className="mb-2 mt-3 text-sm font-bold text-gray-900">
                      {children}
                    </h3>
                  ),

                  code: ({ children }) => (
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-emerald-700">
                      {children}
                    </code>
                  ),

                  pre: ({ children }) => (
                    <pre className="my-3 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-100">
                      {children}
                    </pre>
                  ),
                }}
              >
                {message}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Copy Action - AI Messages */}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-gray-400 opacity-0 transition hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100"
          >
            {copied ? (
              <>
                <Check size={13} />
                Copied
              </>
            ) : (
              <>
                <Copy size={13} />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-200">
          <User size={19} className="text-gray-600" />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;