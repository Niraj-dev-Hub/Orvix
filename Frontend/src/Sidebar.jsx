import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./Mycontext";
import { v1 as uuidv1 } from "uuid";
import api from "./api/axios";
import { useAuth } from "./context/useAuth";

function Sidebar({ isMobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const { allThreads = [], 
    setAllThreads, 
    currThreadId, 
    setNewChat , 
    setPrompt, 
    setReply,
    setCurrThreadId,
    setPrevChat,


  } = useContext(MyContext);

  useEffect(() => {
    let cancelled = false;

    const getAllThreads = async () => {
      try {
        const response = await api.get("/thread");
        if (!cancelled) setAllThreads(response.data);
      } catch (error) {
        if (error.response?.status === 401) return;
        console.error("Failed to load chat history:", error);
      }
    };

    getAllThreads();
    return () => {
      cancelled = true;
    };
  }, [setAllThreads]);

  useEffect(() => {
    if (!isMobileOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") onMobileClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMobileOpen, onMobileClose]);


  const createNewThread = async () =>{
    try {
      setNewChat(true);
      setPrompt("");
      setReply(null);
      setCurrThreadId(uuidv1());
      setPrevChat([]);
      onMobileClose();
    } catch (err) {
      console.error(err);
    }
  }

  const changeThread = async (newThreadId) =>{
    try{
     const response = await api.get(`/thread/${encodeURIComponent(newThreadId)}`);
     const res = response.data;
     setCurrThreadId(newThreadId);
     setPrevChat(Array.isArray(res?.messages) ? res.messages : []);
     setNewChat(false);
     setReply(null);
     onMobileClose();

    } catch(err){
      console.error("Failed to open conversation:", err);

    }


  }

  const deleteThread = async(threadId) =>{
    try{
      await api.delete(`/thread/${encodeURIComponent(threadId)}`);

      // updates the allthreads
      setAllThreads((threads) => threads.filter((thread) => thread.threadId !== threadId));

      if(currThreadId === threadId){
        setCurrThreadId(null);
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setPrevChat([]);
        
      }
    } catch(err){
      console.error("Failed to delete conversation:", err);
    }
  }

  return (
    <>
    {isMobileOpen && (
      <button
        className="sidebarBackdrop"
        type="button"
        aria-label="Close chat history"
        onClick={onMobileClose}
      />
    )}
    <aside className={`sidebar${collapsed ? " isCollapsed" : ""}${isMobileOpen ? " isMobileOpen" : ""}`} aria-label="Chat history">
      <header className="sidebarHeader">
        <div className="sidebarBrand">
          <img src="/orvix-mark.svg" alt="" className="logo" />
          <span className="sidebarBrandText">Orvix</span>
        </div>
        <button
          className="sidebarIconButton mobileCloseButton"
          type="button"
          onClick={onMobileClose}
          aria-label="Close sidebar"
          title="Close sidebar"
        >
          <i className="fa-solid fa-xmark" />
        </button>
        <button
          className="sidebarIconButton collapseButton"
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <i className={`fa-solid ${collapsed ? "fa-angles-right" : "fa-angles-left"}`} />
        </button>
      </header>

      <button 
      className="newChatButton" 
      type="button" 
      aria-label="New chat"
      onClick={createNewThread}>
        <i className="fa-solid fa-pen-to-square" />
        <span>New chat</span>
      </button>

      <nav className="history" aria-label="Recent chats">
        <h2 className="historyHeading">Recent</h2>
        <ul className="historyList">
          {allThreads.length === 0 ? (
            <li className="historyItem">No conversations yet</li>
          ) : allThreads.map((thread) => (
            <li
              className={`historyItem${thread.threadId === currThreadId ? " isSelected" : ""}`}
              key={thread.threadId}
            >
              <button
                className="historyOpenButton"
                type="button"
                title={thread.title}
                onClick={() => changeThread(thread.threadId)}
              >
                <i className="fa-regular fa-message" aria-hidden="true" />
                <span>{thread.title}</span>
              </button>
              <button
                className="historyDeleteButton"
                type="button"
                aria-label={`Delete ${thread.title}`}
                title={`Delete ${thread.title}`}
                onClick={() => deleteThread(thread.threadId)}
              >
                <i className="fa-solid fa-trash" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="sidebarFooter">
        <span className="profileMark" aria-hidden="true">
          {(user?.username || user?.email || "U").charAt(0).toUpperCase()}
        </span>
        <span className="profileName">{user?.username || user?.email}</span>
      </footer>
    </aside>
    </>
  );
}

export default Sidebar;
