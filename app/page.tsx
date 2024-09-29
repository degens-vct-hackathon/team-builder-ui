"use client";

import { useEffect, useState } from "react";

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function ChatbotPage() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages) as Message[]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    if (updatedMessages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data: { reply: string } = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: data.reply },
      ]);

      setInput("");
    } catch (error) {
      console.error("Error fetching the bot's response:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chatbot</h1>
      <div
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "1px solid black",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((message, index) => (
          <div key={index} style={{ margin: "5px 0" }}>
            <strong>{message.role === "user" ? "You: " : "Bot: "}</strong>
            <span>{message.content}</span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "80%", marginRight: "10px" }}
      />
      <button onClick={handleSendMessage} style={{ width: "18%" }}>
        Send
      </button>
    </div>
  );
}