import { useState, useCallback } from 'react';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Order Placed!', message: 'Your order #ORD-001 has been placed.', time: '2 min ago', read: false, type: 'order' },
  { id: 2, title: 'Flash Sale!', message: 'Up to 30% off on all mobiles today.', time: '1 hr ago', read: false, type: 'promo' },
  { id: 3, title: 'Shipped!', message: 'Your iPhone 16 order has been shipped.', time: '3 hrs ago', read: true, type: 'order' },
  { id: 4, title: 'New Arrival', message: 'Sony WH-1000XM6 is now available.', time: '1 day ago', read: true, type: 'product' },
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return { notifications, unreadCount, loading, markRead, markAllRead, deleteNotification };
};

export default useNotifications;
