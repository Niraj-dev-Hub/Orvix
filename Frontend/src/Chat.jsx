import './Chat.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { MyContext } from './Mycontext';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

function MarkdownCode({ children, className, ...props }) {
  const [copied, setCopied] = useState(false);
  const code = String(children).replace(/\n$/, '');
  const isCodeBlock = Boolean(className) || code.includes('\n');

  if (!isCodeBlock) {
    return <code className={className} {...props}>{children}</code>;
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="codeBlock">
      <button className="copyCodeButton" type="button" onClick={copyCode}>
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre>
        <code className={className} {...props}>{children}</code>
      </pre>
    </div>
  );
}

function Chat({ loading }) {
  const { prevChat = [], reply } = useContext(MyContext);
  const chats = Array.isArray(prevChat) ? prevChat : [];
  const viewportRef = useRef(null);
  const [displayedReply, setDisplayedReply] = useState('');

  const latestAssistantIndex = chats.reduce(
    (lastIndex, chat, index) => (chat.role === 'assistant' ? index : lastIndex),
    -1,
  );
  const latestAssistantReply = chats[latestAssistantIndex]?.content || '';
  const shouldAnimate = !!reply && reply === latestAssistantReply;

  useEffect(() => {
    if (!latestAssistantReply) {
      setDisplayedReply('');
      return undefined;
    }

    if (!shouldAnimate) {
      setDisplayedReply(latestAssistantReply);
      return undefined;
    }

    const words = latestAssistantReply.match(/\S+(?:\s+|$)/g) || [];
    let wordIndex = 0;
    setDisplayedReply('');

    const interval = window.setInterval(() => {
      wordIndex += 1;
      setDisplayedReply(words.slice(0, wordIndex).join(''));

      if (wordIndex >= words.length) {
        window.clearInterval(interval);
      }
    }, 40);

    return () => {
      window.clearInterval(interval);
    };
  }, [latestAssistantReply, shouldAnimate]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport && (chats.length > 0 || loading)) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [chats, displayedReply, loading]);

  return (
    <main className="chatViewport" aria-live="polite" ref={viewportRef}>
      {chats.length === 0 ? (
        <section className="welcomeState">
          <img className="welcomeMark" src="/orvix-mark.svg" alt="" />
          <h1>What can I help with?</h1>
          <p>Ask a question, explore an idea, or get something done.</p>
        </section>
      ) : (
        <div className="chats">
          {chats.map((chat, idx) => (
            <article
              className={chat.role === 'user' ? 'messageRow userRow' : 'messageRow assistantRow'}
              key={`${chat.role}-${idx}`}
            >

              {
              chat.role !== 'user' && <img className="assistantMark" src="/orvix-mark.svg" alt="" />}
              {chat.role === 'user' ? (
                <p className="userMsg">{chat.content}</p>
              ) : (
                <div className="gptMsg">
                  <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                    components={{ code: MarkdownCode }}
                  >
                    {idx === latestAssistantIndex ? displayedReply : chat.content}
                  </ReactMarkdown>
                </div>
              )}
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