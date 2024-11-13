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
  const [messages, setMessages] = useState([configDefault.lex.initialText]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const chatClient = useRef(null);
  const agentName = useRef("");
  const [isCustomerEndingChat, setIsCustomerEndingChat] = useState(false);
  const [typingLoader, setTypingLoader] = useState(false);
  const [showClickToCall, setShowClickToCall] = useState(false); // New state to show ClickToCall

  const messagesEndRef = useRef(null);

  const [userDetails, setUserDetails] = useState(null); //prechat form

  const startChat = () => {
    console.log("Starting chat with details:", userDetails);
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  // API call to send "Hello" on chat load
  useEffect(() => {
    if (open && userDetails) {
      const sendInitialMessage = async () => {
        setMessageLoading(true);
        try {
          const payload = {
            region: configDefault.lex.region,
            session_id: sessionId,
            text: "Hello",
            Attributes: userDetails,
          };
          const response = await axios.post(lex_url, payload);
          const processedMessages = ProcessLexResponse(
            response?.data?.messages
          );
          setMessages((prevMessages) => [
            ...prevMessages,
            ...processedMessages,
          ]);
          setMessageLoading(false);
        } catch (error) {
          console.error("Failed to send initial message:", error);
          setMessages((prevMessages) => [
            ...prevMessages,
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
      sendInitialMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, sessionId, userDetails]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  const handleSend = async () => {
    console.log("handleSend called with input:", input);
    if (!input.trim()) return;

    if (isConnected) {
      console.log("Sending live chat message");
      setMessageLoading(false); // Don't show typing loader after sending message to live chat
      try {
        await sendLiveChatMessage(
          input,
          setMessages,
          chatClient,
          setInput,
          sessionId
        );
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
      }
    } else {
      console.log("Sending Lex message");
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          userText: input,
        },
      ]);
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
        const processedMessages = ProcessLexResponse(response.data.messages);
        setMessages((prevMessages) => [...prevMessages, ...processedMessages]);

        // Check if sessionAttributes are returned for live agent initialization
        const sessionAttributes =
          response.data?.sessionState?.sessionAttributes;
        if (
          sessionAttributes &&
          sessionAttributes.ContactId &&
          sessionAttributes.ParticipantId &&
          sessionAttributes.ParticipantToken
        ) {
          console.log("Initializing chat with live agent");

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
            userDetails // Pass customer details object (name, email, phone) from pre-chat form
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
    }
  };

  // Handle ending the chat
  const handleEndChat = () => {
    endChat(
      chatClient,
      setMessages,
      setChatEnded,
      setIsConnected,
      agentName,
      setTypingLoader,
      setSessionId
    );
  };

  // Handle closing the chatbot
  const handleCloseChatbot = () => {
    if (messages.length > 1) {
      setConfirmClose(true);
    } else {
      closeChat(
        setMessages,
        setInput,
        setOpen,
        setChatEnded,
        agentName,
        setIsConnected,
        setTypingLoader
      );
      setUserDetails(null); // Reset form on chat close
    }
  };

  // Confirm and close the chat
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
    setUserDetails(null); // Reset form on chat close
  };

  const cancelCloseChat = () => {
    setConfirmClose(false);
  };

  const handleCloseClickToCall = () => {
    setShowClickToCall(false); // Reset the state when ClickToCall widget closes
  };

  const handleButtonClick = async (buttonText) => {
    const userMessage = { userText: buttonText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setMessageLoading(true);

    if (["call", "clicktocall"].includes(buttonText.toLowerCase())) {
      // Show the ClickToCall widget
      setShowClickToCall(true);
      setMessageLoading(false); // Disable message loading when ClickToCall is active
      return;
    }

    try {
      if (isConnected) {
        await sendLiveChatMessage(
          buttonText,
          setMessages,
          isConnected,
          chatClient,
          setInput,
          (name) =>
            initializeChat(
              setMessages,
              setIsConnected,
              setIsCustomerEndingChat,
              setChatEnded,
              agentName,
              chatClient,
              isCustomerEndingChat,
              null,
              null,
              null,
              setSessionId,
              userDetails // Pass customer details object (name, email, phone) from pre-chat form
            )
        );
      } else {
        const payload = {
          region: configDefault.lex.region,
          session_id: sessionId,
          text: buttonText,
          Attributes: userDetails,
        };

        const response = await axios.post(lex_url, payload);
        const processedMessages = ProcessLexResponse(response?.data?.messages);
        setMessages((prevMessages) => [...prevMessages, ...processedMessages]);

        // Check if sessionAttributes are returned for live agent initialization
        const sessionAttributes =
          response.data?.sessionState?.sessionAttributes;
        if (
          sessionAttributes &&
          sessionAttributes.ContactId &&
          sessionAttributes.ParticipantId &&
          sessionAttributes.ParticipantToken
        ) {
          console.log("Initializing chat with live agent");

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
            userDetails // Pass customer details object (name, email, phone) from pre-chat form
          );
        }
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
      setShowClickToCall(false);
    }
  };

  const handleFormSubmit = async (submitButtonValue, formValues) => {
    // Add the submit button value as userText to the messages state
    setMessages((prevMessages) => [
      ...prevMessages,
      { userText: submitButtonValue },
    ]);

    setMessageLoading(true);

    try {
      const payload = {
        region: configDefault.lex.region,
        session_id: sessionId,
        text: submitButtonValue, // Send the button value as text
        formData: formValues, // Send form data as formData in payload
        Attributes: userDetails,
      };

      const response = await axios.post(lex_url, payload);

      const processedMessages = ProcessLexResponse(response?.data?.messages);
      setMessages((prevMessages) => [...prevMessages, ...processedMessages]);
    } catch (error) {
      console.error("Failed to send form data:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          botText: {
            contentType: "PlainText",
            content: "Error occurred while processing your form data.",
          },
        },
      ]);
    } finally {
      setMessageLoading(false);
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      {!open && (
        <Tooltip title="Open Chatbot" placement="top">
          <IconButton color="primary" onClick={() => setOpen(true)}>
            <img src={botImg} alt="chatbot" height={60} width={60} />
          </IconButton>
        </Tooltip>
      )}
      {open && (
        <Paper elevation={3} className={styles.chatPaper}>
          {!userDetails ? (
            <PreChatForm
              setUserDetails={setUserDetails}
              startChat={startChat}
              handleCloseChatbot={handleCloseChatbot}
            />
          ) : (
            <>
              <div className={styles.header}>
                <img
                  src={botImg}
                  alt="chatbot"
                  className={styles.botImageHead}
                />
                <Typography variant="h6">RetailPal</Typography>
                <Tooltip title="Close">
                  <IconButton size="small" onClick={handleCloseChatbot}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </div>
              <div className={styles.messageContainer}>
                {/* {messages.map((msg, index) => ( */}
                {messages.map((msg, index) => {
                  // Check if the message is an ImageResponseCard and if there are >= 4 messages after it

                  const disableButtons = messages.length - index > 4;
                  return (
                    <React.Fragment key={index}>
                      <Messages
                        msg={msg}
                        index={index}
                        handleButtonClick={handleButtonClick}
                        handleFormSubmit={handleFormSubmit}
                        disableButtons={disableButtons} // Pass disable condition to Messages
                      />
                    </React.Fragment>
                  );
                })}

                {!showClickToCall && (messageLoading || typingLoader) && (
                  <div className={styles.loaderContainer}>
                    <TypingLoader />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className={styles.inputContainer}>
                <TextField
                  autoFocus
                  size="small"
                  fullWidth
                  label="Type a message"
                  variant="outlined"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className={styles.inputField}
                  autoComplete="off"
                />
                <IconButton
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={handleSend}
                  disabled={!input}
                  className={styles.sendButton}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </div>
              {isConnected && !chatEnded && (
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  className={styles.endChatButton}
                  onClick={handleEndChat}
                >
                  End Chat
                </Button>
              )}

              {/* Render the ClickToCall component over the chatbot */}
              {showClickToCall && (
                <div>
                  <ClickToCall
                    triggerChatLoad={showClickToCall}
                    onCloseClickToCall={handleCloseClickToCall}
                  />
                </div>
              )}

              {confirmClose && (
                <div className={styles.confirmDialog}>
                  <div className={styles.confirmContent}>
                    <DialogTitle>
                      Confirm Exit?
                      <Tooltip title="Cancel">
                        <IconButton
                          size="small"
                          onClick={cancelCloseChat}
                          className={styles.cancelButton}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        On exiting, all chat history will be cleared.
                      </DialogContentText>
                      <Button
                        onClick={confirmCloseChat}
                        variant="outlined"
                        fullWidth
                        size="large"
                        className={styles.confirmButton}
                      >
                        Confirm
                      </Button>
                    </DialogContent>
                  </div>
                </div>
              )}
            </>
          )}
        </Paper>
      )}
    </div>
  );
};

export default CustomChatbot;
