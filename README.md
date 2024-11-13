import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import botImg from "../../Images/bot.png";
import styles from "../componentStyling/CustomChatbot.module.css";
import {
  closeChat,
  endChat,
  initializeChat,
  sendMessage as sendLiveChatMessage,
} from "../StartChatContact";
import { configDefault } from "../../config";
import TypingLoader from "../TypingLoader";
import Messages from "../Messages";
import ProcessLexResponse from "../ProcessLexResponse";
import PreChatForm from "../PreChatForm";
import ClickToCall from "../ClickToCall";

const lex_url = process.env.REACT_APP_LEX_API_GATEWAY;

const CustomChatbot = ({ sessionId, setSessionId }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const chatClient = useRef(null);
  const agentName = useRef("");
  const [typingLoader, setTypingLoader] = useState(false);
  const [showClickToCall, setShowClickToCall] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to the bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  // Render initial message on chatbot open
  const renderInitialMessage = async () => {
    setMessageLoading(true);
    try {
      const payload = {
        region: configDefault.lex.region,
        session_id: sessionId,
        text: "Hello",
        Attributes: userDetails,
      };
      const response = await axios.post(lex_url, payload);
      const processedMessages = ProcessLexResponse(response?.data?.messages);
      setMessages([...processedMessages]); // Directly set the initial response
      setMessageLoading(false);
    } catch (error) {
      console.error("Failed to render initial message:", error);
      setMessages([
        {
          botText: {
            contentType: "PlainText",
            content: "Error occurred while initializing your message.",
          },
        },
      ]);
      setMessageLoading(false);
    }
  };

  // Open chatbot with initial message load
  const handleOpenChatbot = async () => {
    setOpen(true);
    if (!messages.length) {
      await renderInitialMessage(); // Ensure the initial message loads on open
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prevMessages) => [...prevMessages, { userText: input }]);
    setInput("");
    setMessageLoading(true);

    try {
      const payload = {
        region: configDefault.lex.region,
        session_id: sessionId,
        text: input,
        Attributes: userDetails,
      };
      const response = await axios.post(lex_url, payload);
      const processedMessages = ProcessLexResponse(response?.data?.messages);
      setMessages((prevMessages) => [...prevMessages, ...processedMessages]);

      // Check sessionAttributes for live agent chat initialization
      const sessionAttributes =
        response.data?.sessionState?.sessionAttributes;
      if (
        sessionAttributes &&
        sessionAttributes.ContactId &&
        sessionAttributes.ParticipantId &&
        sessionAttributes.ParticipantToken
      ) {
        await initializeChat(
          setMessages,
          setIsConnected,
          setChatEnded,
          agentName,
          chatClient,
          setTypingLoader,
          false,
          sessionAttributes.ContactId,
          sessionAttributes.ParticipantId,
          sessionAttributes.ParticipantToken,
          setSessionId,
          userDetails
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          botText: {
            contentType: "PlainText",
            content: "Error occurred while processing your message.",
          },
        },
      ]);
    } finally {
      setMessageLoading(false);
    }
  };

  const handleButtonClick = async (buttonText) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { userText: buttonText },
    ]);
    setMessageLoading(true);

    if (["call", "clicktocall"].includes(buttonText.toLowerCase())) {
      setShowClickToCall(true);
      setMessageLoading(false);
      return;
    }

    try {
      const payload = {
        region: configDefault.lex.region,
        session_id: sessionId,
        text: buttonText,
        Attributes: userDetails,
      };
      const response = await axios.post(lex_url, payload);
      const processedMessages = ProcessLexResponse(response?.data?.messages);
      setMessages((prevMessages) => [...prevMessages, ...processedMessages]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setMessageLoading(false);
    }
  };

  const handleCloseChatbot = () => {
    setConfirmClose(true);
  };

  const confirmCloseChat = () => {
    setConfirmClose(false);
    closeChat(
      setMessages,
      setInput,
      setOpen,
      setChatEnded,
      agentName,
      setIsConnected,
      setTypingLoader,
      chatClient,
      setSessionId
    );
    setUserDetails(null);
  };

  return (
    <div className={styles.chatbotContainer}>
      {!open && (
        <Tooltip title="Open Chatbot" placement="top">
          <IconButton color="primary" onClick={handleOpenChatbot}>
            <img src={botImg} alt="chatbot" height={60} width={60} />
          </IconButton>
        </Tooltip>
      )}
      {open && (
        <Paper elevation={3} className={styles.chatPaper}>
          <div className={styles.header}>
            <img src={botImg} alt="chatbot" className={styles.botImageHead} />
            <Typography variant="h6">RetailPal</Typography>
            <Tooltip title="Close">
              <IconButton size="small" onClick={handleCloseChatbot}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
          <div className={styles.messageContainer}>
            {messages.map((msg, index) => (
              <Messages
                key={index}
                msg={msg}
                handleButtonClick={handleButtonClick}
              />
            ))}
            {!showClickToCall && (messageLoading || typingLoader) && (
              <TypingLoader />
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className={styles.inputContainer}>
            <TextField
              size="small"
              fullWidth
              label="Type a message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input}
            >
              <SendIcon />
            </IconButton>
          </div>
        </Paper>
      )}
    </div>
  );
};

export default CustomChatbot;