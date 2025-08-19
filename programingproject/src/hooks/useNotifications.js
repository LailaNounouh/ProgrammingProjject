import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthProvider';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    console.log('🔌 Setting up WebSocket connection for user:', user);

    // Connect to WebSocket
    const newSocket = io('http://localhost:3000');
    
    newSocket.on('connect', () => {
      console.log('🔌 Connected to WebSocket');
      // Join user-specific room
      const roomName = `${user.type}-${user.id}`;
      newSocket.emit('join', roomName);
      console.log(`👤 Joined room: ${roomName}`);
    });

    // Listen for notifications
    newSocket.on('notification', (notification) => {
      console.log('🔔 New notification received:', notification);
      
      // Add to notifications list
      setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep max 50
      
      // Show browser notification if supported
      if (Notification.permission === 'granted') {
        new Notification('CareerLaunch', {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.id
        });
      }
      
      // Show toast notification
      showToast(notification);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from WebSocket');
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔴 WebSocket connection error:', error);
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Cleaning up WebSocket connection');
      newSocket.disconnect();
    };
  }, [user?.id, user?.type]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('🔔 Notification permission:', permission);
      });
    }
  }, []);

  const showToast = (notification) => {
    // Create toast element
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 400px;
      word-wrap: break-word;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      line-height: 1.4;
      animation: slideIn 0.3s ease-out;
      cursor: pointer;
    `;
    
    // Add animation keyframes if not exists
    if (!document.querySelector('#toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    toast.textContent = notification.message;
    
    // Add click to dismiss
    toast.onclick = () => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    };
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
      }
    }, 5000);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    markAsRead,
    clearNotifications,
    unreadCount: notifications.filter(n => !n.read).length,
    socket
  };
};