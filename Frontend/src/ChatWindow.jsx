import "./ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from "./Mycontext";
import { useContext, useState } from "react";
import api from "./api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import { v1 as uuidv1 } from "uuid";

function ChatWindow({ onOpenSidebar }) {
  const {
    prompt,
    setPrompt,
    currThreadId,
    setCurrThreadId,
    setNewChat,
    setPrevChat,
    setAllThreads,
    setReply,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLogoutError("");
    try {
      await logout();
      setAllThreads([]);
      setPrevChat([]);
      setPrompt("");
      setReply(null);
      setCurrThreadId(uuidv1());
      setNewChat(true);
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("Failed to log out:", error);
      setLogoutError("Unable to log out. Please try again.");
    }
  };

  const getReply = async () => {
    const message = prompt.trim();
    if (!message || loading) return;

    setLoading(true);
    setPrompt("");
    setReply(null);
    setPrevChat((messages) => [
      ...messages,
      { role: "user", content: message },
    ]);

    try {
      const response = await api.post("/chat", { message, threadId: currThreadId });
      const result = response.data;
      setReply(result.reply);
      setPrevChat((messages) => [
        ...messages,
        { role: "assistant", content: result.reply },
      ]);
      setAllThreads((threads) => {
        const currentThread = threads.find(
          (thread) => thread.threadId === currThreadId,
        );
        const updatedThread = {
          ...currentThread,
          threadId: currThreadId,
          title: currentThread?.title || message,
          updatedAt: new Date().toISOString(),
        };

        return [
          updatedThread,
          ...threads.filter((thread) => thread.threadId !== currThreadId),
        ];
      });
    } catch (err) {
      const status = err.response?.status;
      const requestId = err.response?.data?.requestId
        || err.response?.headers?.["x-request-id"];
      console.error("Failed to send chat message:", {
        status: status || "network error",
        requestId,
        message: err.message,
        serverError: err.response?.data?.error
      });

      let errorMessage;
      if (!status) {
        errorMessage = "Couldn't reach the chat service. Check your connection and try again.";
      } else if (status === 401) {
        errorMessage = "Your session may have expired. Please sign in again.";
      } else if (status === 429) {
        errorMessage = "The AI service is busy or its quota is exhausted. Please try again later.";
      } else if (status >= 500) {
        errorMessage = `The chat service failed (${status}). Check the backend logs${requestId ? ` for request ${requestId}` : ""}.`;
      } else {
        errorMessage = `The chat request failed (${status}). Please try again.`;
      }

      setPrevChat((messages) => [
        ...messages,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ChatWindow">
      <div className="navbar">
        <button
          className="mobileMenuButton"
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open chat history"
        >
          <i className="fa-solid fa-bars" aria-hidden="true" />
        </button>
        <span className="orvix">
          Orvix
          <i className="fa-solid fa-chevron-down"></i>
        </span>
        <button
          className="userIconDiv"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Account menu"
          aria-expanded={isOpen}
        >
          <span className="userIcon">
            {" "}
            <i className="fa-solid fa-user"></i>{" "}
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="dropDownDiv">
          <div className="dropDownItems"> <i className="fa-solid fa-crown"></i> Upgrade Plan</div>
          <div className="dropDownItems"><i className="fa-solid fa-gear"></i>Settings</div>
          <button className="dropDownItems" type="button" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket" aria-hidden="true"></i>
            Log out
          </button>
        </div>
      )}
      {logoutError && <p className="chatError" role="alert">{logoutError}</p>}

      <Chat loading={loading} />

      <form
        className="chatinput"
        onSubmit={(event) => {
          event.preventDefault();
          getReply();
        }}
      >
        <div className="inputBox">
          <input
            className="promptInput"
            type="text"
            placeholder="Message Orvix"
            aria-label="Message Orvix"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <button
            className="sendButton"
            type="submit"
            disabled={!prompt.trim() || loading}
            aria-label="Send message"
          >
            <span className="sendArrow" aria-hidden="true" />
          </button>
        </div>

        <p className="info">
          Orvix can make mistakes. Check important info. See cookies
          preferences.
        </p>
      </form>
    </div>
  );
}

export default ChatWindow;
