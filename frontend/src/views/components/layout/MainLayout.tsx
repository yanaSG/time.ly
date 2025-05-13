// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import SideNav from '../ui/SideNav';
// import Footer from '../ui/Footer';
import { ReactNode, useState } from 'react';

type MainLayoutProps = {
  children?: ReactNode;
};

const MainLayout: React.FC = ({ children }: MainLayoutProps) => {
  

  return (
    <div className="max-h-screen max-w-screen flex bg-gray-50">
      <SideNav />
      
      <main className="w-full flex-1 mx-auto py-8 px-4 bg-[#EDEDED]">
        
        {children || <Outlet />}
      </main>
      
      {/* <Footer className="mt-auto" /> */}
    </div>
  );    
}

export default MainLayout;