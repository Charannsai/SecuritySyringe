"use client";

import React, { useState } from "react";

// --- Icons ---
const SparklesIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.576-2.576l.813-2.846A.75.75 0 019 4.5zM9 15a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 019 15z"
      clipRule="evenodd"
    />
  </svg>
);

const MailIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
  </svg>
);

const SendIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const LoadingSpinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function GeminiApp() {
  const [activeTab, setActiveTab] = useState("chat"); // 'chat' | 'email'

  // Chat State
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);

  // Email State
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // --- Handlers ---

  const handleSendChat = async () => {
    if (!input.trim()) return;

    setChatLoading(true);
    setChatError(null);
    setResponse("");

    try {
      const res = await fetch(
        "/api/p/4eQLm88J/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: input }],
              },
            ],
          }),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "No response received";

      setResponse(text);
    } catch (err) {
      console.error(err);
      setChatError("Failed to get response from Gemini.");
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!to || !subject || !message) {
      setEmailStatus("Please fill all email fields");
      return;
    }

    const recipients = to
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (recipients.length === 0) {
      setEmailStatus("No valid email addresses found");
      return;
    }

    setEmailLoading(true);
    setEmailStatus("");

    try {
      for (const recipient of recipients) {
        const res = await fetch("/api/p/4eQLm88J/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "EasyBuild <no-reply@charanfolio.site>",
            to: recipient,
            subject,
            html: `<p>${message.replace(/\n/g, "<br/>")}</p>`,
          }),
        });

        if (!res.ok) throw new Error(await res.text());
      }

      setEmailStatus(`Email sent successfully to ${recipients.length} recipient(s) ✅`);
      setTo("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setEmailStatus("Failed to send email. Please try again. ❌");
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex items-center justify-center p-4 sm:p-8 font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[100px] opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] opacity-50"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
            EasyBuild <span className="text-zinc-600 font-thin mx-2">|</span> Proxy
          </h1>
          <p className="text-zinc-500">
            Securely interact with AI & Communication services
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Tabs */}
          <div className="flex border-b border-zinc-800">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-4 flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === "chat"
                  ? "bg-zinc-800/50 text-purple-400 border-b-2 border-purple-500"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30"
                }`}
            >
              <SparklesIcon className="w-5 h-5" />
              <span className="font-medium">AI Agent</span>
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`flex-1 py-4 flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === "email"
                  ? "bg-zinc-800/50 text-blue-400 border-b-2 border-blue-500"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30"
                }`}
            >
              <MailIcon className="w-5 h-5" />
              <span className="font-medium">Email Dispatch</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6 md:p-8 min-h-[400px]">
            {activeTab === "chat" ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-zinc-400">Ask Gemini 2.5 Flash</label>
                  <div className="relative">
                    <textarea
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none placeholder-zinc-600"
                      rows={4}
                      placeholder="How can I help you today?"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-zinc-600">
                      {input.length} chars
                    </div>
                  </div>

                  <button
                    onClick={handleSendChat}
                    disabled={chatLoading || !input.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {chatLoading ? (
                      <>
                        <LoadingSpinner /> Thinking...
                      </>
                    ) : (
                      <>
                        <SparklesIcon className="w-5 h-5" /> Generate Response
                      </>
                    )}
                  </button>
                </div>

                {chatError && (
                  <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-red-200 text-sm">
                    {chatError}
                  </div>
                )}

                {response && (
                  <div className="mt-6">
                    <span className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2 block">AI Response</span>
                    <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-2xl p-5 shadow-inner">
                      <p className="whitespace-pre-wrap leading-relaxed text-zinc-300">
                        {response}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Recipient Code</label>
                  <input
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-zinc-600"
                    placeholder="name@example.com (comma separated)"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Subject</label>
                  <input
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-zinc-600"
                    placeholder="Enter subject line..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">Message Body</label>
                  <textarea
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none placeholder-zinc-600 h-32"
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSendEmail}
                    disabled={emailLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {emailLoading ? (
                      <>
                        <LoadingSpinner /> Sending...
                      </>
                    ) : (
                      <>
                        <SendIcon className="w-5 h-5" /> Send Email
                      </>
                    )}
                  </button>
                </div>

                {emailStatus && (
                  <div
                    className={`mt-4 p-4 rounded-xl border flex items-center gap-2 text-sm ${emailStatus.includes("success") || emailStatus.includes("✅")
                        ? "bg-green-900/20 border-green-900/50 text-green-200"
                        : "bg-red-900/20 border-red-900/50 text-red-200"
                      }`}
                  >
                    {emailStatus}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer/Status Bar */}
          <div className="bg-zinc-950/30 p-3 text-center border-t border-zinc-800 text-zinc-600 text-xs">
            Powered by <span className="font-bold text-zinc-400">Google Gemini</span> & <span className="font-bold text-zinc-400">Resend</span>
          </div>
        </div>
      </div>
    </div>
  );
}
