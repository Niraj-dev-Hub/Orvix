import './Chat.css';
import { useContext, useEffect, useRef } from 'react';
import { MyContext } from './Mycontext';

function Chat({ loading }) {
  const { prevChat = [] } = useContext(MyContext);
  const viewportRef = useRef(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport && (prevChat.length > 0 || loading)) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [prevChat, loading]);

  return (
    <main className="chatViewport" aria-live="polite" ref={viewportRef}>
      {prevChat.length === 0 ? (
        <section className="welcomeState">
          <img className="welcomeMark" src="/orvix-mark.svg" alt="" />
          <h1>What can I help with?</h1>
          <p>Ask a question, explore an idea, or get something done.</p>
        </section>
      ) : (
        <div className="chats">
          {prevChat.map((chat, idx) => (
            <article
              className={chat.role === 'user' ? 'messageRow userRow' : 'messageRow assistantRow'}
              key={`${chat.role}-${idx}`}
            >
              {chat.role !== 'user' && <img className="assistantMark" src="/orvix-mark.svg" alt="" />}
              <p className={chat.role === 'user' ? 'userMsg' : 'gptMsg'}>{chat.content}</p>
            </article>
          ))}
          {loading && (
            <div className="messageRow assistantRow">
              <img className="assistantMark" src="/orvix-mark.svg" alt="" />
              <div className="typingIndicator" role="status" aria-label="Orvix is thinking">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default Chat;