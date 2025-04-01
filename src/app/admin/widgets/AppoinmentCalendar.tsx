"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface Appointment {
  _id: string;
  patientName: string;
  startTime: string;
  endTime: string;
  department: string;
}

// Fixed palette of visually distinct Tailwind background classes
const COLORS = [
  "bg-blue-500 border-blue-700",
  "bg-green-500 border-green-700",
  "bg-pink-500 border-pink-700",
  "bg-purple-500 border-purple-700",
  "bg-yellow-500 border-yellow-700",
  "bg-indigo-500 border-indigo-700",
  "bg-rose-500 border-rose-700",
  "bg-amber-500 border-amber-700",
  "bg-teal-500 border-teal-700",
  "bg-orange-500 border-orange-700",
];

// Simple hash function to map a string (patient name) to an index
function getColorClass(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const router = useRouter();
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM – 8 PM

  useEffect(() => {
    const fetchAppointments = async () => {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const res = await fetch(
        `/api/admin/widgets/appointments?date=${dateStr}`
      );
      const json = await res.json();
      setAppointments(json);
    };

    fetchAppointments();
  }, [selectedDate]);

  return (
    <div className="bg-white rounded-2x2 shadow-md p-6 space-y-8 w-full overflow-hidden">
      {/* Calendar */}
      {/* Calendar */}
      <div className="flex justify-center">
        <div className="w-[420px] bg-gray-50 p-4 rounded-xl shadow-sm">
          <Calendar
            onChange={(date) => date instanceof Date && setSelectedDate(date)}
            value={selectedDate}
            className="w-full"
            tileClassName={({ date }) =>
              date.toDateString() === new Date().toDateString()
                ? "bg-blue-500 text-white font-semibold rounded-md"
                : ""
            }
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="pt-2">
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
          📅 Appointments on {format(selectedDate, "MMMM dd, yyyy")}
        </h2>

        <div className="grid grid-cols-1 gap-5 overflow-x-hidden">
          {hours.map((hour) => {
            const matching = appointments.filter((a) => {
              const localTime = new Date(a.startTime);
              return (
                localTime.toDateString() === selectedDate.toDateString() &&
                localTime.getHours() === hour
              );
            });

            return (
              <div key={hour} className="w-full">
                <p className="text-sm text-gray-500 mb-2 font-semibold">{`${hour
                  .toString()
                  .padStart(2, "0")}:00`}</p>

                {matching.length > 0 ? (
                  <div className="flex flex-wrap gap-3 overflow-x-hidden">
                    {matching.map((app, idx) => {
                      const colorClass = getColorClass(app.patientName);
                      console.log(app._id);
                      return (
                        <div
                          key={idx}
                          onClick={() =>
                            router.push(`/admin/appointments/${app._id}`)
                          }
                          className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium text-white shadow-sm border-l-4 ${colorClass} hover:scale-[1.01] transition`}
                        >
                          {app.patientName}
                          <div className="text-xs font-normal">
                            {format(new Date(app.startTime), "hh:mm a")} –{" "}
                            {format(new Date(app.endTime), "hh:mm a")}
                          </div>
                          <div className="text-xs italic opacity-80">
                            {app.department}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 italic">
                    No appointments
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
