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

      <main className="w-full flex-1 mx-auto py-8 px-4 shadow-black/15 shadow-[inset_15px_0_8px_-8px_rgba(0,0,0,0.5)]">
        {children || <Outlet />}
      </main>

      {/* <Footer className="mt-auto" /> */}
    </div>
  );
}

export default MainLayout;