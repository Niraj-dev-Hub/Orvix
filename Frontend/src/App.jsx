import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import {MyContext} from "./Mycontext.jsx";
import './App.css'
import { useState  } from "react";
import {v1 as uuidv1} from "uuid";




function App() {
  const [prompt, setPrompt] =useState("");
  const [reply, setReply] = useState(null);
  const[currThreadId, setCurrThreadId ] =useState(uuidv1());
  const[prevChat, setPrevChat] = useState([]);
  const [newChat, setNewChat] =useState(true);


  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat , setNewChat,
    prevChat , setPrevChat
  };

  


  return (
    <div className="main">
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App
