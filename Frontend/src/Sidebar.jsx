import "./Sidebar.css";
import { useState } from "react";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

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

      <button className="newChatButton" type="button" aria-label="New chat">
        <i className="fa-solid fa-pen-to-square" />
        <span>New chat</span>
      </button>

      <nav className="history" aria-label="Recent chats">
        <h2 className="historyHeading">Recent</h2>
        <ul className="historyList">
          {["history1", "history2", "history 3"].map((title, index) => (
            <li className={`historyItem${index === 0 ? " isSelected" : ""}`} key={title} title={title}>
              <i className="fa-regular fa-message" aria-hidden="true" />
              <span>{title}</span>
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
