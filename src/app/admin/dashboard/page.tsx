'use client';

import { useEffect, useState } from 'react';
import {
  LocalHospital,
  People,
  EventNote,
  Checklist,
  HealthAndSafety,
  CancelScheduleSend,
  Nightlight,
} from '@mui/icons-material';


import AppointmentCalendar from '../widgets/AppoinmentCalendar';
import AvailableDoctors from '../widgets/AvaiableDoctors';

interface DashboardData {
  totalDoctors: number;
  totalPatients: number;
  appointmentsToday: number;
  totalInsurance: number;
  cancelledLastWeek: number;
  nurses: {
    Day: number;
    Night: number;
  };
}

const cardStyles =
  'flex items-center gap-4 bg-white shadow-sm rounded-lg p-4 w-full hover:shadow-md transition';
const iconStyles = 'text-white p-3 rounded-full';

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-800">🏥 Admin Dashboard Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={cardStyles}>
          <div className={`${iconStyles} bg-green-500`}><LocalHospital /></div>
          <div>
            <p className="text-sm text-gray-500">Total Doctors</p>
            <p className="text-xl font-semibold">{data.totalDoctors}</p>
          </div>
        </div>

        <div className={cardStyles}>
          <div className={`${iconStyles} bg-blue-500`}><People /></div>
          <div>
            <p className="text-sm text-gray-500">Active Patients</p>
            <p className="text-xl font-semibold">{data.totalPatients}</p>
          </div>
        </div>

        <div className={cardStyles}>
          <div className={`${iconStyles} bg-indigo-500`}><EventNote /></div>
          <div>
            <p className="text-sm text-gray-500">Appointments Today</p>
            <p className="text-xl font-semibold">{data.appointmentsToday}</p>
          </div>
        </div>

        <div className={cardStyles}>
          <div className={`${iconStyles} bg-cyan-500`}><HealthAndSafety /></div>
          <div>
            <p className="text-sm text-gray-500">Insurance Records</p>
            <p className="text-xl font-semibold">{data.totalInsurance}</p>
          </div>
        </div>

      </div>

      {/* Chart + Calendar layout */}
      <div className="lg:col-span-2 grid lg:grid-cols-3 gap-6">
        {/* Left Side - Charts and Widgets */}
        <div className="col-span-2 grid grid-cols-1 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <AvailableDoctors />
          </div>
          {/* <div className="bg-white rounded-xl shadow-sm p-6">
            <TopDoctorsPie />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <RecentInsuranceUploads />
          </div> */}
        </div>

        {/* Right Side - Appointment Calendar */}
        <div className="bg-white rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
          <div className="border-b p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              📅 Appointment Calendar
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <AppointmentCalendar />
          </div>
        </div>
      </div>
    </div>
  );
}
