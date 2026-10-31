
import { useRef, useState, useEffect } from "react";
import {
  ArrowUp,
  Paperclip,
  Sparkles,
  FileText,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

function ChatInput({
  onSend,
  isLoading,
  chatResetKey,
  selectedFile,
  setSelectedFile,
  isUploading,
  onUpload,
  uploadStatus,
  setUploadStatus,
}) {
  const [input, setInput] = useState("");
  const fileInputRef = useRef(null);

  // Reset ChatInput whenever New Chat is clicked
  useEffect(() => {
    setInput("");
    setSelectedFile(null);
    setUploadStatus(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [chatResetKey, setSelectedFile, setUploadStatus]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const question = input.trim();

    if (!question || isLoading || isUploading) return;

    onSend(question);
    setInput("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedExtensions = [".pdf", ".txt"];

    const extension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setUploadStatus({
        type: "error",
        message: "Only PDF and TXT files are supported.",
      });

      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus({
        type: "error",
        message: "File size must not exceed 10 MB.",
      });

      event.target.value = "";
      return;
    }

    setSelectedFile(file);
    setUploadStatus(null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="border-t border-gray-100 bg-white/90 px-5 py-5 backdrop-blur-xl sm:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Selected File Preview */}
        {selectedFile && (
          <div className="mb-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <FileText size={20} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-800">
                  {selectedFile.name}
                </p>

                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemoveFile}
              disabled={isUploading}
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700 disabled:opacity-50"
              title="Remove file"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Upload Status */}
        {uploadStatus && (
          <div
            className={`mb-3 flex items-start gap-2 rounded-xl border p-3 text-sm ${
              uploadStatus.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {uploadStatus.type === "success" ? (
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
              />
            ) : (
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />
            )}

            <span>{uploadStatus.message}</span>
          </div>
        )}

        {/* Chat Input */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white shadow-sm transition focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50"
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask anything about Indian Income Tax or GST..."
            rows={2}
            disabled={isLoading || isUploading}
            className="w-full resize-none bg-transparent px-5 pt-4 text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:opacity-60"
          />

          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex flex-wrap items-center gap-3">

              {/* AI Indicator */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Sparkles size={14} />
                <span>AI-powered answers</span>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,application/pdf,text/plain"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Attach Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600 disabled:opacity-50"
              >
                <Paperclip size={14} />
                <span>Attach</span>
              </button>

              {/* Upload Button */}
              {selectedFile && (
                <button
                  type="button"
                  onClick={onUpload}
                  disabled={isUploading}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploading ? (
                    <>
                      <Loader2
                        size={14}
                        className="animate-spin"
                      />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      <span>Upload document</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isUploading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLoading ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <ArrowUp size={18} />
              )}
            </button>
          </div>
        </form>

        {/* Disclaimer */}
        <p className="mt-3 text-center text-xs text-gray-400">
          AI-generated responses may contain inaccuracies.
          Verify important tax information with official sources.
        </p>
      </div>
    </div>
  );
}

export default ChatInput;