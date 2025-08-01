'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

// Define types
type Example = { input: string; output: string };
type TestCase = { input: string; expected: string; description: string };
type Question = {
  title: string;
  body: string;
  examples: Example[];
  constraints: string[];
  testCases: TestCase[];
};

type WebSocketMessage = {
  type: 'success' | 'alert' | 'question' | 'join';
  message?: any;
  roomId?: string;
  randomId?: string;
};

type WebSocketContextType = {
  socket: WebSocket | null;
  sendMessage: (data: any) => void;
  joinRoom: (roomId: string, userId: string) => void;
  isConnected: boolean;
  question: Question | null;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastMessage: string | null;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [question, setQuestion] = useState<Question | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  const connectWebSocket = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    console.log('🔄 Attempting to connect to WebSocket...');
    setConnectionStatus('connecting');

    const ws = new WebSocket('ws://localhost:8080');
    socketRef.current = ws;
    setSocket(ws);

    ws.onopen = () => {
      console.log('✅ WebSocket connected successfully');
      setIsConnected(true);
      setConnectionStatus('connected');
      reconnectAttempts.current = 0; // Reset reconnect attempts on successful connection
      setLastMessage('Connected to server');
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        console.log('📩 Message received:', data);

        switch (data.type) {
          case 'question':
            console.log('📝 Question received:', data.message);
            setQuestion(data.message);
            setLastMessage('Question received from interviewer');
            break;
          
          case 'success':
            console.log('✅ Success:', data.message);
            setLastMessage(data.message || 'Action completed successfully');
            break;
          
          case 'alert':
            console.log('⚠️ Alert:', data.message);
            setLastMessage(data.message || 'Server alert received');
            break;
          
          default:
            console.log('📨 Unknown message type:', data.type);
            setLastMessage(`Unknown message: ${data.type}`);
        }
      } catch (err) {
        console.error('❌ Failed to parse WebSocket message:', err);
        console.error('Raw message:', event.data);
        setLastMessage('Failed to parse server message');
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setConnectionStatus('error');
      setIsConnected(false);
      setLastMessage('Connection error occurred');
    };

    ws.onclose = (event) => {
      console.log('🔌 WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      setLastMessage('Disconnected from server');

      // Attempt to reconnect if it wasn't a manual close
      if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        console.log(`🔄 Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 2000 * reconnectAttempts.current); // Exponential backoff
      } else if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.log('❌ Max reconnection attempts reached');
        setLastMessage('Connection failed after multiple attempts');
      }
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close(1000, 'Component unmounting'); // Clean close
      }
    };
  }, []);

  const sendMessage = (data: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messageStr = JSON.stringify(data);
      console.log('📤 Sending message:', messageStr);
      socketRef.current.send(messageStr);
    } else {
      console.warn('⚠️ WebSocket is not open. Current state:', socketRef.current?.readyState);
      console.warn('Message not sent:', data);
      setLastMessage('Cannot send message - not connected');
    }
  };

  const joinRoom = (roomId: string, userId: string) => {
    console.log(`🚪 Attempting to join room: ${roomId} with user ID: ${userId}`);
    
    if (!roomId || !userId) {
      console.error('❌ Room ID and User ID are required');
      setLastMessage('Room ID and User ID are required');
      return;
    }

    const joinMessage = {
      type: 'join',
      roomId: roomId,
      randomId: userId
    };

    sendMessage(joinMessage);
    setLastMessage(`Joining room: ${roomId}`);
  };

  const contextValue: WebSocketContextType = {
    socket,
    sendMessage,
    joinRoom,
    isConnected,
    question,
    connectionStatus,
    lastMessage,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};