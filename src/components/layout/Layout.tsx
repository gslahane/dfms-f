
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
