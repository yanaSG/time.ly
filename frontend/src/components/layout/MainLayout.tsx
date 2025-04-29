// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import { ReactNode } from 'react';

type MainLayoutProps = {
  children?: ReactNode;
};

const MainLayout: React.FC = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        {children || <Outlet />}
      </main>
      
      <Footer className="mt-auto" />
    </div>
  );    
}

export default MainLayout;