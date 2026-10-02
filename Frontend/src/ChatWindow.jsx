import "./ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from "./Mycontext";
import { useContext, useState } from "react";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    currThreadId,
    setPrevChat,
    setAllThreads,
    setReply,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // change afterwards

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
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, threadId: currThreadId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Request failed");
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
      console.error(err);
      setPrevChat((messages) => [
        ...messages,
        {
          role: "assistant",
          content: "I couldn't get a response. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ChatWindow">
      <div className="navbar">
        <span className="orvix">
          Orvix
          <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick= {() => setIsOpen(!isOpen)}>
          <span className="userIcon">
            {" "}
            <i className="fa-solid fa-user"></i>{" "}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="dropDownDiv">
          <div className="dropDownItems"> <i className="fa-solid fa-crown"></i> Upgrade Plan</div>
          <div className="dropDownItems"><i className="fa-solid fa-gear"></i>Settings</div>
          <div className="dropDownItems"><i className="fa-solid fa-right-from-bracket"></i>Log out</div>
        </div>
      )}

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
