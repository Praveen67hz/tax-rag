
import { ShieldCheck, Menu } from "lucide-react";

function ChatHeader({ onMenuClick }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">

      {/* Left Section */}
      <div className="flex items-center gap-3">

        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
        >
          <Menu size={21} />
        </button>

        <div>
          <h2 className="text-base font-semibold text-gray-800">
            Tax Assistant
          </h2>

          <p className="text-xs text-gray-500">
            Indian Income Tax & GST
          </p>
        </div>

      </div>

      {/* Right Section */}
      <div className="flex items-center">

        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
          <ShieldCheck size={15} className="text-emerald-600" />

          <span className="text-xs font-medium text-emerald-700">
            AI Powered
          </span>
        </div>

      </div>

    </header>
  );
}

export default ChatHeader;