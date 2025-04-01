'use client';

import { Card, CardContent } from '@mui/material';
import { ReactNode } from 'react';

interface DashboardCardProps {
  icon: ReactNode;
  value: number | string;
  label: string;
  color: string;
}

export default function DashboardCard({ icon, value, label, color }: DashboardCardProps) {
  return (
    <Card className="shadow-sm rounded-xl">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={`p-3 rounded-full text-white ${color}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-gray-500">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
