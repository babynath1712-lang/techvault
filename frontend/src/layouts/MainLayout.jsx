import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1, paddingTop: 'var(--nav-height)' }}>
      {children}
    </main>
    <Footer />
  </div>
);

export default MainLayout;
