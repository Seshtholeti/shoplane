import React, { useState } from "react";
import Chatbot from "./Chatbot";
import "./App.css"; // Styles for the widget and the chatbot

const App = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const openChatbot = () => {
    setIsChatbotOpen(true);
  };

  const closeChatbot = () => {
    setIsChatbotOpen(false);
  };

  return (
    <div className="app-container">
      {isChatbotOpen && <Chatbot closeChatbot={closeChatbot} />}
      
      {!isChatbotOpen && (
        <div className="chat-widget" onClick={openChatbot}>
          <span>💬</span>
        </div>
      )}
    </div>
  );
};

export default App;

import React, { useState } from "react";
import "./Chatbot.css"; // You can style as per your preference

const Chatbot = ({ closeChatbot }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input) return;

    const newMessage = { sender: "user", text: input };
    setMessages([...messages, newMessage]);
    setInput("");

    try {
      const response = await fetch("YOUR_API_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Booking Bot</h3>
        <button className="close-btn" onClick={closeChatbot}>
          X
        </button>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "bot" ? "bot-message" : "user-message"}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSend} disabled={!input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;


/* Style for the chatbot widget */
.chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Chatbot container styling */
.chatbot-container {
  width: 300px;
  height: 400px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 80px;
  right: 20px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

/* Chatbot header styling */
.chatbot-header {
  background-color: #007bff;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px 10px 0 0;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

/* Messages area styling */
.chatbot-messages {
  padding: 10px;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 300px;
}

.user-message {
  text-align: right;
  background-color: #007bff;
  color: white;
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: 10px;
}

.bot-message {
  text-align: left;
  background-color: #e0e0e0;
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: 10px;
}

/* Input container styling */
.chatbot-input-container {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
}

.chatbot-input-container input {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.chatbot-input-container button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
}

.chatbot-input-container button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
