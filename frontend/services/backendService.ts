import { User, Message } from '../types';

// Backend API URL - Update this to match your backend server
const BACKEND_API_URL = "http://127.0.0.1:8000/api/v1"; 

/**
 * A backend service that communicates with the FastAPI backend.
 * Handles user creation, conversation management, and message storage.
 */
export const backendService = {
  /**
   * Saves a new lead (user) by sending it to the backend API.
   */
  saveLead: async (user: User): Promise<{ id: number }> => {
    console.log('SENDING LEAD TO BACKEND:', user);
    
    try {
      const response = await fetch(`${BACKEND_API_URL}/users/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
          name: user.name,
          contact_method: user.contactMethod,
          contact_info: user.contactInfo
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedUser = await response.json();
      console.log('USER SAVED WITH ID:', savedUser.id);
      
      return { id: savedUser.id };
    } catch (error) {
      console.error('Failed to save lead to backend:', error);
      throw error; // Re-throw to allow the caller to handle the error
    }
  },

  /**
   * Sends a message to the AI chat endpoint and returns the response.
   */
  sendChatMessage: async (
    userId: number, 
    message: string, 
    language: string, 
    conversationId?: number
  ): Promise<{ response: string; conversationId: number; messageId: number }> => {
    console.log('SENDING CHAT MESSAGE:', { userId, message, language, conversationId });
    
    try {
      const response = await fetch(`${BACKEND_API_URL}/chat/send-message`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
          message,
          user_id: userId,
          language,
          conversation_id: conversationId
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('CHAT RESPONSE:', result);
      
      return {
        response: result.response,
        conversationId: result.conversation_id,
        messageId: result.message_id
      };
    } catch (error) {
      console.error('Failed to send chat message:', error);
      throw error;
    }
  },

  /**
   * Gets conversation history for a user.
   */
  getConversationHistory: async (conversationId: number): Promise<any> => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/conversations/${conversationId}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get conversation history:', error);
      throw error;
    }
  },

  /**
   * Legacy method for backward compatibility - now just logs the conversation
   * since individual message sending is handled by sendChatMessage
   */
  saveConversation: async (user: User, messages: Message[]): Promise<void> => {
    const contactIdentifier = `${user.contactMethod}: ${user.contactInfo}`;
    console.log('CONVERSATION LOG for:', contactIdentifier, messages);
    // This is now handled automatically by the chat endpoint
  },


};
