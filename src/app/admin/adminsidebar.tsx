'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PeopleIcon from '@mui/icons-material/People';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const links = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <DashboardIcon />, color: 'bg-blue-500' },
  { label: 'Doctors', href: '/admin/doctors', icon: <LocalHospitalIcon />, color: 'bg-green-500' },
  { label: 'Patients', href: '/admin/patients', icon: <PeopleIcon />, color: 'bg-indigo-500' },
  { label: 'Nurses', href: '/admin/nurses', icon: <MedicalServicesIcon />, color: 'bg-pink-500' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-60 bg-[#0f172a] text-white flex flex-col py-4 shadow-sm z-10" >
      {/* Logo / Brand */}
      <div className="h-16 flex items-center px-6 text-2xl font-bold tracking-wide text-white">
        <span className="text-blue-400">+</span> Healthcare
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 space-y-2 px-2">
        {links.map(({ label, href, icon, color }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className="block">
              <div
                className={`flex items-center gap-3 rounded-lg px-4 py-2 transition-all ${
                  isActive
                    ? 'bg-blue-600 shadow text-white'
                    : 'hover:bg-slate-800 text-gray-300'
                }`}
              >
                <div
                  className={`p-1.5 rounded-full ${color} bg-opacity-20 text-white`}
                >
                  <Tooltip title={label} placement="right">
                    <span className="text-lg">{icon}</span>
                  </Tooltip>
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
