import "./ChatWindow.css";
import Chat from "./Chat";
import { MyContext } from "./Mycontext";
import { useContext, useState } from "react";

function ChatWindow() {
  const { prompt, setPrompt, currThreadId, setPrevChat } =
    useContext(MyContext);
  const [loading, setLoading] = useState(false);

  const getReply = async () => {
    const message = prompt.trim();
    if (!message || loading) return;

    setLoading(true);
    setPrompt("");
    setPrevChat((messages) => [...messages, { role: "user", content: message }]);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, threadId: currThreadId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Request failed");
      setPrevChat((messages) => [...messages, { role: "assistant", content: result.reply }]);
    } catch (err) {
      console.error(err);
      setPrevChat((messages) => [
        ...messages,
        { role: "assistant", content: "I couldn't get a response. Please try again." },
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
        <div className="userIconDiv">
          <span className="userIcon">
            {" "}
            <i className="fa-solid fa-user"></i>{" "}
          </span>
        </div>
      </div>
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
          <button className="sendButton" type="submit" disabled={!prompt.trim() || loading} aria-label="Send message">
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
