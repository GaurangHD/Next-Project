import AdminSidebar from './adminsidebar';
import AdminHeader from './adminheader';
import AdminFooter from './adminfooter';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex min-h-screen">
        <div className="w-60 fixed top-0 left-0 bottom-0 z-20">
          <AdminSidebar />
        </div>
  
        <div className="flex-1 ml-60 bg-gray-50 min-h-screen flex flex-col">
          <div className="fixed top-0 left-60 right-0 z-10">
            <AdminHeader />
          </div>
  
          <main className="pt-20 px-6 pb-16 flex-1">{children}</main>   
  
          <AdminFooter />
        </div>
      </div>
    );
  }