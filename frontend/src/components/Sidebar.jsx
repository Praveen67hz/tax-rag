
import {
  Plus,
  Landmark,
  PanelLeftClose,
  UserCircle,
} from "lucide-react";

function Sidebar({ isOpen, onNewChat, onClose,  conversations, activeConversationId, onSelectConversation,}) {
  if (!isOpen) return null;

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-gray-200 bg-gray-50">

      {/* Application Branding */}
      <div className="flex items-center gap-3 border-b border-gray-200 p-5">
        <div className="rounded-xl bg-emerald-600 p-2">
          <Landmark className="h-6 w-6 text-white" />
        </div>

        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Tax Assistant
          </h1>
          <p className="text-xs text-gray-500">
            Indian Tax AI
          </p>
        </div>

        <button
          onClick={onClose}
          className="ml-auto rounded-lg p-2 text-gray-500 transition hover:bg-gray-200"
          title="Close sidebar"
          aria-label="Close sidebar"
        >
          <PanelLeftClose size={19} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-3 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          <Plus size={19} />
          New Chat
        </button>
      </div>

      {/* Recent Conversations */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Recent Conversations
        </p>

        {conversations.length === 0 ? (
          <p className="px-2 py-3 text-sm text-gray-400">
            Your conversations will appear here.
          </p>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full truncate rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  conversation.id === activeConversationId
                    ? "bg-emerald-100 font-medium text-emerald-800"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {conversation.title}
              </button>
            ))}
          </div>
        )}
      </div>
        
      {/* User Profile Placeholder */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <UserCircle className="h-9 w-9 text-gray-500" />

          <div>
            <p className="text-sm font-medium text-gray-800">
              User
            </p>
            <p className="text-xs text-gray-500">
              Tax Assistant
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;