import axios from "axios";
import { configDefault } from "../../config";

const instanceId = process.env.REACT_APP_INSTANCE_ID;
const contactFlowId = process.env.REACT_APP_CONTACT_FLOW_ID;
const region = process.env.REACT_APP_REGION;
const live_chat_url = process.env.REACT_APP_LIVE_AGENT_API_GATEWAY;

export const initializeChat = async (
  setMessages,
  setIsConnected,
  setChatEnded,
  agentName,
  chatClient,
  setTypingLoader,
  isCustomerEndingChat,
  contactId = null, // New parameters
  participantId = null,
  participantToken = null,
  setSessionId,
  userDetails // Pass customer details object (name, email, phone) from pre-chat form
) => {
  // Reset session state before initializing new chat
  setChatEnded(false);
  setIsConnected(false);
  agentName.current = ""; // Reset agent name
  setTypingLoader(false);

  const { name, email, phoneNumber } = userDetails; // Destructure customer details
  try {
    const payload = {
      InstanceId: instanceId,
      ContactFlowId: contactFlowId,
      ParticipantDetails: {
        DisplayName: name,
      },
      Attributes: {
        customerName: name,
        Name: name, // Name from pre-chat form
        "Phone Number": phoneNumber, // Phone number from pre-chat form
        "Email Id": email, // Email from pre-chat form
      },
    };

    let chatDetails;

    // If contactId, participantId, and participantToken are passed, use them
    if (contactId && participantId && participantToken) {
      chatDetails = {
        ContactId: contactId,
        ParticipantId: participantId,
        ParticipantToken: participantToken,
      };
    } else {
      const response = await axios.post(live_chat_url, payload);
      chatDetails = {
        ContactId: response?.data?.data?.startChatResult.ContactId,
        ParticipantId: response?.data?.data?.startChatResult.ParticipantId,
        ParticipantToken:
          response?.data?.data?.startChatResult.ParticipantToken,
      };
    }

    chatClient.current = await window.connect.ChatSession.create({
      chatDetails,
      type: "CUSTOMER",
      options: { region },
    });

    chatClient.current.connect().then(() => {
      setIsConnected(true);
      agentName.current = ""; // Reset agent name for new chat session

      chatClient.current.onMessage((event) => {
        const { data } = event;
        const isAgentMessage = data.ParticipantRole === "AGENT";
        if (isAgentMessage && !agentName.current) {
          agentName.current = data.DisplayName || "Agent";
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              botText: {
                contentType: "PlainText",
                content: `${agentName.current} has joined the chat`,
              },
            },
          ]);
        }
        if (
          ["AGENT", "SYSTEM"].includes(data.ParticipantRole) &&
          data.Content.trim()
        ) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              botText: {
                contentType: "PlainText",
                content: data.Content,
              },
            },
          ]);
        }

        // Stop typing loader when agent sends a message
        if (isAgentMessage) {
          setTypingLoader(false);
        }
      });

      chatClient.current.onTyping((event) => {
        const { data } = event;
        if (data.ParticipantRole === "AGENT") {
          setTypingLoader(true);
        }
      });

      chatClient.current.onEnded((event) => {
        if (chatClient.current.isCustomerEndingChat) {
          setChatEnded(true);
          setIsConnected(false);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              botText: {
                contentType: "PlainText",
                content: `${agentName.current} left the chat`,
              },
            },
            {
              botText: {
                contentType: "PlainText",
                content: "Chat Ended with Live Agent",
              },
            },
          ]);
          setChatEnded(true);
          setIsConnected(false);

          setSessionId();
        }
      });
    });
  } catch (error) {
    console.error("Failed to connect to the chat agent:", error);
    setChatEnded(true);
    setIsConnected(false);
  }
};

export const closeChat = (
  setMessages,
  setInput,
  setOpen,
  setChatEnded,
  agentName,
  setIsConnected,
  setTypingLoader,
  chatClient, // Add chatClient to cleanup session
  setSessionId
) => {
  console.log("Closing chat");
  setMessages([configDefault.lex.initialText]);
  setInput("");
  setOpen(false);
  setChatEnded(true);
  agentName.current = ""; // Reset agent name
  setIsConnected(false);
  setTypingLoader(false);
  setSessionId();

  if (chatClient.current) {
    chatClient.current = null; // Clear out chat client reference
  }
};

export const endChat = (
  chatClient,
  setMessages,
  setChatEnded,
  setIsConnected,
  agentName,
  setTypingLoader,
  setSessionId
) => {
  console.log("Ending chat");
  if (chatClient.current) {
    try {
      chatClient.current.disconnectParticipant();
      chatClient.current = null; // Clear out chat client reference
      setChatEnded(true);
      setIsConnected(false);
    } catch (error) {
      console.error("Failed to disconnect chat client:", error);
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        botText: {
          contentType: "PlainText",
          content: "You left the chat",
        },
      },
      {
        botText: {
          contentType: "PlainText",
          content: "Chat Ended with Live Agent",
        },
      },
    ]);
    agentName.current = ""; // Reset agent name
    setTypingLoader(false);
    setSessionId();
  }
};

export const sendMessage = async (input, setMessages, chatClient, setInput) => {
  console.log("sendMessage called with input:", input);
  if (input.trim() === "") return;

  const messageToSend = input;
  setMessages((prev) => [
    ...prev,
    {
      userText: input,
    },
  ]);
  setInput("");

  try {
    console.log("Sending message to chat client");
    await chatClient.current.sendMessage({
      message: messageToSend,
      contentType: "text/plain",
    });
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};
