import { useState, useRef, useEffect } from "react";
import api from "../api";
import Breadcrumbs from "./Breadcrumbs";

function Chat({ sidebarOpen, setSidebarOpen }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", { message: input });
      const assistantMessage = {
        role: "assistant",
        content: res.data.response,
        sources: res.data.sources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error en chat:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Hubo un error al procesar tu mensaje." },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar con Breadcrumbs */}
      <div className="h-11 border-b border-stone-200 flex items-center px-3">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 hover:bg-stone-100 rounded transition mr-2"
          >
            <svg
              className="w-5 h-5 text-stone-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-stone-400">💬</span>
          <span className="text-stone-400">/</span>
          <span className="text-stone-600">Chat con Neura</span>
        </div>
      </div>

      {/* Messages - resto igual */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-stone-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-stone-700">
                Chatea con tus notas
              </h3>
              <p className="text-stone-400 mt-1 text-sm">
                Pregunta cualquier cosa sobre lo que has guardado
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-lg ${msg.role === "user" ? "order-2" : ""}`}
              >
                <div className="flex items-start gap-3">
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 bg-stone-800 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-medium">N</span>
                    </div>
                  )}
                  <div>
                    <div
                      className={`px-4 py-2.5 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-stone-800 text-white"
                          : "bg-stone-100 text-stone-700"
                      }`}
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                    </div>

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {msg.sources.map((s, j) => (
                          <span
                            key={j}
                            className="text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded-full border border-stone-200"
                          >
                            📄 {s.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 bg-stone-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-stone-600 text-xs font-medium">
                        Tú
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-stone-800 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-medium">N</span>
                </div>
                <div className="px-4 py-2.5 bg-stone-100 rounded-2xl">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-stone-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-stone-200 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 items-center bg-stone-100 rounded-xl px-4 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pregunta algo sobre tus notas..."
              className="flex-1 bg-transparent outline-none text-stone-700 placeholder-stone-400"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="p-2 text-stone-400 hover:text-stone-600 disabled:text-stone-300 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
