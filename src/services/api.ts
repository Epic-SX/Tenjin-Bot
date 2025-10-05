/**
 * REST API Service
 * Complete REST API integration for Tenjin Chat
 * 
 * BACKEND API REQUIREMENTS:
 * Your backend should implement these endpoints:
 * 
 * Authentication:
 * - POST   /api/auth/signup       - User registration
 * - POST   /api/auth/login        - User login
 * - POST   /api/auth/logout       - User logout
 * - GET    /api/auth/verify       - Verify token
 * 
 * Conversations:
 * - GET    /api/conversations     - List all conversations
 * - POST   /api/conversations     - Create new conversation
 * - GET    /api/conversations/:id - Get single conversation
 * - PUT    /api/conversations/:id - Update conversation
 * - DELETE /api/conversations/:id - Delete conversation
 * 
 * Messages:
 * - GET    /api/conversations/:id/messages - Get messages in conversation
 * - POST   /api/conversations/:id/messages - Send message
 * - PUT    /api/messages/:id                - Update message (pin, expand)
 * - DELETE /api/messages/:id                - Delete message
 * 
 * Files:
 * - POST   /api/upload            - Upload files
 * 
 * Chat AI:
 * - POST   /api/chat              - Send message to AI
 */

import type { Message } from '../types';

// ============================================================================
// API Configuration
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Set authentication token in localStorage
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// ============================================================================
// TypeScript Interfaces
// ============================================================================

// --- Authentication Types ---
export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      name?: string;
    };
  };
  error?: {
    message: string;
    code: string;
  };
}

// --- Conversation Types ---
export interface Conversation {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messageCount?: number;
}

export interface CreateConversationRequest {
  title: string;
  firstMessage?: string;
}

export interface ConversationResponse {
  success: boolean;
  data?: Conversation;
  error?: {
    message: string;
    code: string;
  };
}

export interface ConversationsListResponse {
  success: boolean;
  data?: {
    conversations: Conversation[];
    total: number;
  };
  error?: {
    message: string;
    code: string;
  };
}

// --- Message Types ---
export interface SendMessageRequest {
  text: string;
  conversationId: string;
  replyTo?: string;
  attachments?: string[]; // URLs of uploaded files
}

export interface MessageResponse {
  success: boolean;
  data?: {
    userMessage: Message;
    aiMessage: Message;
  };
  error?: {
    message: string;
    code: string;
  };
}

export interface MessagesListResponse {
  success: boolean;
  data?: {
    messages: Message[];
    total: number;
  };
  error?: {
    message: string;
    code: string;
  };
}

export interface UpdateMessageRequest {
  pinned?: boolean;
  expanded?: boolean;
}

// --- File Upload Types ---
export interface FileUploadResponse {
  success: boolean;
  data?: {
    fileUrl: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  };
  error?: {
    message: string;
    code: string;
  };
}

// --- Chat AI Types (Legacy support) ---
export interface ApiRequestData {
  input: string;
  userId: string;
  sessionId: string;
  parameters?: Record<string, any>;
}

export interface ApiSuccessResponse {
  success: true;
  data: {
    output: string;
    metadata: {
      processingTime: number;
      timestamp: string;
    };
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: Record<string, any>;
  };
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// ============================================================================
// HTTP Helper Functions
// ============================================================================

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();

    // Handle HTTP errors
    if (!response.ok) {
      throw new Error(data.error?.message || `HTTP error! Status: ${response.status}`);
    }

    return data as T;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ============================================================================
// Authentication API
// ============================================================================

/**
 * Register a new user
 */
export const signup = async (data: SignupRequest): Promise<AuthResponse> => {
  try {
    const response = await fetchAPI<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data?.token) {
      setAuthToken(response.data.token);
    }

    return response;
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Signup failed',
        code: 'SIGNUP_ERROR',
      },
    };
  }
};

/**
 * Login user
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await fetchAPI<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data?.token) {
      setAuthToken(response.data.token);
    }

    return response;
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Login failed',
        code: 'LOGIN_ERROR',
      },
    };
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await fetchAPI('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeAuthToken();
  }
};

/**
 * Verify authentication token
 */
export const verifyToken = async (): Promise<boolean> => {
  try {
    const response = await fetchAPI<{ success: boolean }>('/auth/verify', {
      method: 'GET',
    });
    return response.success;
  } catch (error) {
    return false;
  }
};

// ============================================================================
// Conversations API
// ============================================================================

/**
 * Get all conversations for the current user
 */
export const getConversations = async (): Promise<ConversationsListResponse> => {
  try {
    return await fetchAPI<ConversationsListResponse>('/conversations', {
      method: 'GET',
    });
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch conversations',
        code: 'FETCH_ERROR',
      },
    };
  }
};

/**
 * Create a new conversation
 */
export const createConversation = async (
  data: CreateConversationRequest
): Promise<ConversationResponse> => {
  try {
    return await fetchAPI<ConversationResponse>('/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to create conversation',
        code: 'CREATE_ERROR',
      },
    };
  }
};

/**
 * Get a single conversation by ID
 */
export const getConversation = async (id: string): Promise<ConversationResponse> => {
  try {
    return await fetchAPI<ConversationResponse>(`/conversations/${id}`, {
      method: 'GET',
    });
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch conversation',
        code: 'FETCH_ERROR',
      },
    };
  }
};

/**
 * Update a conversation (e.g., rename)
 */
export const updateConversation = async (
  id: string,
  data: { title: string }
): Promise<ConversationResponse> => {
  try {
    return await fetchAPI<ConversationResponse>(`/conversations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to update conversation',
        code: 'UPDATE_ERROR',
      },
    };
  }
};

/**
 * Delete a conversation
 */
export const deleteConversation = async (id: string): Promise<{ success: boolean }> => {
  try {
    return await fetchAPI<{ success: boolean }>(`/conversations/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    return { success: false };
  }
};

// ============================================================================
// Messages API
// ============================================================================

/**
 * Get all messages in a conversation
 */
export const getMessages = async (conversationId: string): Promise<MessagesListResponse> => {
  try {
    return await fetchAPI<MessagesListResponse>(`/conversations/${conversationId}/messages`, {
      method: 'GET',
    });
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch messages',
        code: 'FETCH_ERROR',
      },
    };
  }
};

/**
 * Send a message and get AI response
 */
export const sendMessage = async (
  conversationId: string,
  data: Omit<SendMessageRequest, 'conversationId'>
): Promise<MessageResponse> => {
  try {
    return await fetchAPI<MessageResponse>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to send message',
        code: 'SEND_ERROR',
      },
    };
  }
};

/**
 * Update a message (pin, expand, etc.)
 */
export const updateMessage = async (
  messageId: string,
  data: UpdateMessageRequest
): Promise<{ success: boolean; data?: Message }> => {
  try {
    return await fetchAPI<{ success: boolean; data?: Message }>(`/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  } catch (error) {
    return { success: false };
  }
};

/**
 * Delete a message
 */
export const deleteMessage = async (messageId: string): Promise<{ success: boolean }> => {
  try {
    return await fetchAPI<{ success: boolean }>(`/messages/${messageId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    return { success: false };
  }
};

// ============================================================================
// File Upload API
// ============================================================================

/**
 * Upload a file
 */
export const uploadFile = async (file: File): Promise<FileUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const token = getAuthToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    return data as FileUploadResponse;
  } catch (error) {
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'File upload failed',
        code: 'UPLOAD_ERROR',
      },
    };
  }
};

// ============================================================================
// Legacy Chat API (for backward compatibility)
// ============================================================================

/**
 * Makes a POST request to the REST API endpoint (Legacy)
 * @deprecated Use sendMessage instead
 */
export const apiCall = async (inputData: ApiRequestData): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(inputData)
    });

    const data = await response.json();

    switch (response.status) {
      case 200:
        return data as ApiSuccessResponse;
      
      case 400:
        throw new Error(`Invalid request: ${data.error?.message || 'Bad Request'}`);
      
      case 401:
        throw new Error('Unauthorized: Invalid credentials.');
      
      case 429:
        throw new Error('Rate limit exceeded. Please try again later.');
      
      case 500:
        throw new Error('Server error. Please contact support.');
      
      default:
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return data;
    }
  } catch (error) {
    console.error('API request failed:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        error: {
          message: error.message,
          code: 'NETWORK_ERROR',
          details: {}
        }
      };
    }
    
    return {
      success: false,
      error: {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        details: {}
      }
    };
  }
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generates a unique session ID
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Generates a unique user ID (or retrieves from storage)
 */
export const getUserId = (): string => {
  let userId = localStorage.getItem('userId');
  
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  
  return userId;
};

/**
 * Gets or creates a session ID for the current session
 */
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('sessionId');
  
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('sessionId', sessionId);
  }
  
  return sessionId;
};


