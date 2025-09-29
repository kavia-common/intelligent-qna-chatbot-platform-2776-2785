import api from './api';

// PUBLIC_INTERFACE
export async function listConversations() {
  /** Returns all conversations for the authenticated user. */
  const { data } = await api.get('/conversations/');
  return data;
}

// PUBLIC_INTERFACE
export async function createConversation(title) {
  /** Creates a new conversation. */
  const { data } = await api.post('/conversations/', { title });
  return data;
}

// PUBLIC_INTERFACE
export async function getConversation(conversationId) {
  /** Returns conversation with messages. */
  const { data } = await api.get(`/conversations/${conversationId}/`);
  return data;
}

// PUBLIC_INTERFACE
export async function deleteConversation(conversationId) {
  /** Deletes a conversation. */
  await api.delete(`/conversations/${conversationId}/`);
  return true;
}

// PUBLIC_INTERFACE
export async function sendMessage({ message, conversation_id, system_prompt }) {
  /** Sends a message and returns assistant response and updated thread. */
  const { data } = await api.post('/chat/', { message, conversation_id, system_prompt });
  return data;
}
