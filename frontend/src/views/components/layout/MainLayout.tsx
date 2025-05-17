// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import SideNav from '../ui/SideNav';
// import Footer from '../ui/Footer';
import { ReactNode } from 'react';

type MainLayoutProps = {
  children?: ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div
      className="flex max-h-screen max-w-screen bg-[#E0E0E0] relative"
      style={{
      background: 'radial-gradient(circle at bottom right, #FCD05D 0%, transparent 30%)',
      }}
    >
      <SideNav />
      <main
        className="w-full flex-1 shadow-[inset_15px_0_15px_-8px_rgba(0,0,0,0.5)] shadow-emerald-950/30 relative bg-[url('/deco-corner.svg')] bg-no-repeat bg-left-top sm:bg-[length:40%] bg-[length:100%] before:content-[''] before:absolute before:inset-0 before:bg-[#E0E0E0] before:opacity-30 before:pointer-events-none"
      >
        {children || <Outlet />}
      </main>

      {/* <Footer className="mt-auto" /> */}
    </div>
  );
};

export default MainLayout;
