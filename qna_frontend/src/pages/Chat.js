import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { createConversation, deleteConversation, getConversation, listConversations, sendMessage } from '../services/conversations';
import { ErrorBanner } from '../components/UI';

// PUBLIC_INTERFACE
export default function ChatPage() {
  /** Main chat page with conversations sidebar and chat view. */
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Initial load
  useEffect(() => {
    (async () => {
      try {
        const data = await listConversations();
        setConversations(data || []);
        if (data?.length) {
          setActiveId(data[0].id);
        }
      } catch (e) {
        // 401 is handled globally; show generic error for other cases
        setError('Failed to load conversations.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeId) { setMessages([]); return; }
    (async () => {
      try {
        const conv = await getConversation(activeId);
        setMessages(conv?.messages || []);
      } catch (e) {
        setMessages([]);
        // 401 handled globally; optionally show non-401 error
      }
    })();
  }, [activeId]);

  const onCreate = async () => {
    const title = prompt('Title for the new conversation?', 'New conversation');
    if (!title) return;
    try {
      const conv = await createConversation(title);
      const updated = [conv, ...conversations];
      setConversations(updated);
      setActiveId(conv.id);
      setError('');
    } catch (e) {
      setError('Failed to create conversation.');
    }
  };

  const onDelete = async (id) => {
    // confirm
    if (!window.confirm('Delete this conversation?')) return;
    try {
      await deleteConversation(id);
      const next = conversations.filter(c => c.id !== id);
      setConversations(next);
      if (activeId === id) {
        setActiveId(next[0]?.id ?? null);
      }
      setError('');
    } catch (e) {
      setError('Failed to delete conversation.');
    }
  };

  const onSelect = (id) => setActiveId(id);

  const onSend = async (content) => {
    setSending(true);
    try {
      const payload = { message: content, conversation_id: activeId || undefined };
      const data = await sendMessage(payload);
      // Update active conversation and messages
      if (!activeId && data?.conversation_id) {
        setActiveId(data.conversation_id);
      }
      if (Array.isArray(data?.messages)) {
        setMessages(data.messages);
      } else {
        // Optimistic append
        setMessages(prev => [...prev, { role: 'user', content }, { role: 'assistant', content: data?.assistant || '' }]);
      }
      // refresh conversations list
      const refreshed = await listConversations();
      setConversations(refreshed || []);
      setError('');
    } catch (e) {
      setError('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="main">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={onSelect}
        onCreate={onCreate}
        onDelete={onDelete}
      />
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 8 }}>
          <ErrorBanner message={error} />
        </div>
        <ChatWindow messages={messages} onSend={onSend} sending={sending} />
      </section>
    </main>
  );
}
