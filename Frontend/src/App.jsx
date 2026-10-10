import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./Mycontext.jsx";

import "./App.css";

import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

import { Navigate, Route, Routes } from "react-router-dom";

import Auth from "./Auth.jsx";
import { useAuth } from "./context/useAuth";

function App() {
  const { user, loading } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChat, setPrevChat] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt,
    setPrompt,

    reply,
    setReply,

    currThreadId,
    setCurrThreadId,

    newChat,
    setNewChat,

    prevChat,
    setPrevChat,

    allThreads,
    setAllThreads
  };

  if (loading) {
    return (
      <main className="auth-page">
        <p role="status">Checking your session...</p>
      </main>
    );
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : <Auth />}
      />
      <Route
        path="/"
        element={user ? (
          <div className="main">
            <MyContext.Provider value={providerValues}>
              <Sidebar />
              <ChatWindow />
            </MyContext.Provider>
          </div>
        ) : <Navigate to="/auth" replace />}
      />
      <Route path="*" element={<Navigate to={user ? "/" : "/auth"} replace />} />
    </Routes>
  );
}

export default App;