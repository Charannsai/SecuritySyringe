import React, { useState } from "react";

export default function GeminiChat() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Email states
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const PROJECT_KEY = "eb_iYuw3iKOxnpi5f608gJ1hUrh";

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResponse("");

    try {
      const res = await fetch(
        "https://api.useverse.app/api/p/KueBkKCG/v1beta/models/gemini-2.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-project-key": PROJECT_KEY,
          },
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

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "No response received";

      setResponse(text);
    } catch (err) {
      console.error(err);
      setError("Failed to get AI response");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
  if (!to || !subject || !message) {
    setEmailStatus("Please fill all email fields");
    return;
  }

  const recipients = to
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    setEmailStatus("No valid email addresses found");
    return;
  }

  setLoading(true);
  setEmailStatus("");

  try {
    for (const recipient of recipients) {
      const res = await fetch(
        "https://api.useverse.app/api/p/3jcaEGwY/emails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-project-key": PROJECT_KEY,
          },
          body: JSON.stringify({
            from: "EasyBuild <no-reply@charanfolio.site>",
            to: recipient,
            subject,
            html: `<p>${message.replace(/\n/g, "<br/>")}</p>`,
          }),
        }
      );

      if (!res.ok) {
        throw new Error(await res.text());
      }
    }

    setEmailStatus(`Email sent to ${recipients.length} recipients ✅`);

    setTo("");
    setSubject("");
    setMessage("");
  } catch (err) {
    console.error(err);
    setEmailStatus("Failed to send one or more emails ❌");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h2 className="text-xl font-semibold">Gemini AI Chat</h2>

      <textarea
        className="w-full border rounded p-2"
        rows={4}
        placeholder="Ask something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {loading ? "Thinking..." : "Send to Gemini"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {response && (
        <div className="bg-gray-100 p-3 rounded">
          <strong>AI:</strong>
          <p className="whitespace-pre-wrap">{response}</p>
        </div>
      )}

      <hr />

      <h2 className="text-xl font-semibold">Send Email (Resend via EasyBuild)</h2>

      <input
        className="w-full border rounded p-2"
        placeholder="To (email address)"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <input
        className="w-full border rounded p-2"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <textarea
        className="w-full border rounded p-2"
        rows={4}
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSendEmail}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Email"}
      </button>

      {emailStatus && (
        <p
          className={`${
            emailStatus.includes("success")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {emailStatus}
        </p>
      )}
    </div>
  );
}
