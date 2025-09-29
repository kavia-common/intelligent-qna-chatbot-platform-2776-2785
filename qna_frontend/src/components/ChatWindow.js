import React, { useEffect, useRef, useState } from 'react';

// PUBLIC_INTERFACE
export default function ChatWindow({ messages, onSend, sending }) {
  /** Chat window displaying messages and input area. */
  const [text, setText] = useState('');
  const viewportRef = useRef(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, sending]);

  const submit = (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    onSend(content);
    setText('');
  };

  return (
    <section className="chat">
      <div className="messages" ref={viewportRef}>
        {messages?.length ? messages.map((m, idx) => (
          <article key={m.id ?? idx} className={`msg ${m.role}`}>
            <div className="msg-header">
              <span>{m.role === 'user' ? 'You' : m.role === 'assistant' ? 'Assistant' : 'System'}</span>
              {m.created_at && <span>· {new Date(m.created_at).toLocaleTimeString()}</span>}
            </div>
            <div>{m.content}</div>
          </article>
        )) : (
          <article className="msg system">
            Start the conversation with a question. Your assistant is ready!
          </article>
        )}
      </div>
      <form className="input-area" onSubmit={submit}>
        <textarea
          className="input"
          placeholder="Ask anything..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary send" type="submit" disabled={sending}>
          {sending ? 'Sending…' : 'Send'} ➤
        </button>
      </form>
    </section>
  );
}
