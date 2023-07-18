import React, { useState } from "react";
import axios from "axios";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SendIcon from '@mui/icons-material/Send';
import ChatGPTIcon from "../images/ChatGPT.png";
import PersonIcon from '@mui/icons-material/Person';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

const ChatBubble: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCloseButtonVisible, setIsCloseButtonVisible] = useState(false);

  const toggleChat = () => {
    setIsChatOpen((prevIsChatOpen) => !prevIsChatOpen);
    setIsCloseButtonVisible((prevIsCloseButtonVisible) => !prevIsCloseButtonVisible);
  };

  const toggleCloseButton = () => {
    setIsCloseButtonVisible((prevIsCloseButtonVisible) => !prevIsCloseButtonVisible);
  };

  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    const userMessage = { id: Date.now().toString(), content: inputText, isUser: true };
    console.log(inputText);
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText("");

    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const maxTokens = 500;

    try {
      setIsProcessing(true);
      const response = await axios.post(
        apiUrl,
        {
          messages: [
            { role: "user", content: inputText },
          ],
          model: "gpt-3.5-turbo",
          max_tokens: maxTokens,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content;

      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), content: aiResponse, isUser: false },
      ]);

      setInputText("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-12 right-4 z-50">
      <div className="flex flex-col items-end">
        {!isChatOpen && (
          <button
            className="fixed bottom-12 right-12 w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg focus:outline-none"
            onClick={toggleChat}
          >
            <ChatBubbleIcon />
          </button>
        )}

        {isChatOpen && (
          <div className="flex flex-col max-w-md bg-white rounded-lg shadow-lg w-full md:max-w-xl" style={{ width: "400px", height: "400px" }}>
            {isCloseButtonVisible && (
              <div className="flex justify-between mb-2 bg-blue-500 p-2 w-full">
                <div className="text-lg font-bold">Du lịch cùng ChatGPT</div>
                <button
                  className="w-8 h-8 bg-blue-500 text-white rounded-full shadow-lg focus:outline-none"
                  onClick={toggleChat}
                >
                  X
                </button>
              </div>
            )}
            <div className="flex-grow overflow-auto" style={{ maxHeight: "70%" }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 p-3 rounded ${
                    message.isUser ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {message.isUser ? (
                    <>
                      <span className="ml-2">{message.content}</span>
                      <div className="flex justify-end mt-1">
                        <PersonIcon />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-start mb-1">
                        <img src={ChatGPTIcon} alt="ChatGPT" className="w-6 h-6" />
                      </div>
                      <span className="ml-2">{message.content}</span>
                    </>
                  )}
                </div>
              ))}
              {messages[messages.length - 1]?.isUser && isProcessing && (
                <div className="flex items-center mb-3">
                  <img src={ChatGPTIcon} alt="ChatGPT" className="w-6 h-6" />
                  <div>...</div>
                </div>
              )}
            </div>
            <div className="flex mt-3">
              <input
                type="text"
                value={inputText}
                placeholder="Bạn hỏi gì đi..."
                onChange={(e) => setInputText(e.target.value)}
                className="flex-grow border border-gray-300 rounded py-2 px-3 mr-2"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white rounded py-2 px-3"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
