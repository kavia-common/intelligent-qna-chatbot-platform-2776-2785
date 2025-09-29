import React from 'react';
import { format } from 'date-fns';

// PUBLIC_INTERFACE
export default function Sidebar({ conversations, activeId, onSelect, onCreate, onDelete }) {
  /** Sidebar showing conversation history and actions. */
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Conversations</div>
        <button className="btn" onClick={onCreate}>+ New</button>
      </div>
      <div className="sidebar-list">
        {conversations?.length ? conversations.map((c) => (
          <div
            key={c.id}
            className={`conv-item ${activeId === c.id ? 'active' : ''}`}
            onClick={() => onSelect(c.id)}
            role="button"
            tabIndex={0}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ fontWeight: 600 }}>{c.title || `Conversation #${c.id}`}</div>
              <button
                className="btn"
                title="Delete conversation"
                onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
              >
                🗑
              </button>
            </div>
            <div className="conv-meta">
              <span>#{c.id}</span>
              {c.updated_at && <span>· {format(new Date(c.updated_at), 'MMM d, HH:mm')}</span>}
            </div>
          </div>
        )) : (
          <div className="conv-item" style={{ textAlign: 'center' }}>
            No conversations yet
          </div>
        )}
      </div>
    </aside>
  );
}
