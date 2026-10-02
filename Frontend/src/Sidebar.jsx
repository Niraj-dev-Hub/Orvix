import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./Mycontext";
import {v1 as uuidv1} from "uuid";


function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
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
        const response = await fetch("http://localhost:8080/api/thread");
        if (!response.ok) throw new Error("Failed to fetch threads");

        const threads = await response.json();
        if (!cancelled) setAllThreads(threads);
      } catch (error) {
        console.error("Failed to load chat history:", error);
      }
    };

    getAllThreads();
    return () => {
      cancelled = true;
    };
  }, [setAllThreads]);


  const createNewThread = async () =>{
    try {
      setNewChat(true);
      setPrompt("");
      setReply(null);
      setCurrThreadId(uuidv1());
      setPrevChat([]);




    } catch (err) {
      console.error(err);
    }
  }

  const changeThread = async (newThreadId) =>{
    setCurrThreadId(newThreadId);

    try{
     const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
     const res = await response.json();
     console.log(res);
     setPrevChat(Array.isArray(res?.messages) ? res.messages : []);
     setNewChat(false);
     setReply(null);

    } catch(err){
      console.error(err);

    }


  }

  const deleteThread = async(threadId) =>{
    try{
      const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
        method:"DELETE",
      });

      const res= await response.json();
      console.log(res);


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
      console.error(err);
    }
  }

  return (
    <aside className={`sidebar${collapsed ? " isCollapsed" : ""}`} aria-label="Chat history">
      <header className="sidebarHeader">
        <div className="sidebarBrand">
          <img src="/orvix-mark.svg" alt="" className="logo" />
          <span className="sidebarBrandText">Orvix</span>
        </div>
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
              title={thread.title}
              onClick= { () => changeThread(thread.threadId)}

            >

            


              <i className="fa-regular fa-message" aria-hidden="true" />
              <span>{thread.title}</span>
                <i className="fa-solid fa-trash"
                onClick= {(e) =>{
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
                ></i>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="sidebarFooter">
        <span className="profileMark" aria-hidden="true">N</span>
        <span className="profileName">By Nir</span>
        <i className="fa-solid fa-ellipsis" aria-hidden="true" />
      </footer>
    </aside>
  );
}

export default Sidebar;
