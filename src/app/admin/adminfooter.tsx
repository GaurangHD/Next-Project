'use client';

export default function AdminFooter() {
  return (
    <footer className="fixed bottom-0 left-60 right-0 h-10 flex items-center justify-center text-xs text-gray-400 bg-white border-t z-10">
      &copy; {new Date().getFullYear()} Healthcare CRM. All rights reserved.
    </footer>
  );
}
