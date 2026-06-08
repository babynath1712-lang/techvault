import { Toaster } from 'react-hot-toast';

const Toast = () => (
  <Toaster
    position="top-right"
    gutter={12}
    toastOptions={{
      duration: 3500,
      style: {
        background: 'var(--bg-elevated)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        boxShadow: 'var(--shadow-lg)',
        padding: '12px 18px',
      },
      success: {
        iconTheme: { primary: 'var(--success)', secondary: 'transparent' },
      },
      error: {
        iconTheme: { primary: 'var(--error)', secondary: 'transparent' },
      },
    }}
  />
);

export default Toast;
