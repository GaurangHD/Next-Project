'use client';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Avatar,
  Badge,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Notifications, Search } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminHeader() {
  const [open, setOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [unread, setUnread] = useState(true);

  const toggleModal = () => {
    setOpen(!open);
    setUnread(false); // mark as seen
  };

  const fetchTodaysAppointments = async () => {
    try {
      const res = await axios.get('/api/admin/appointments/today');
      console.log(res);
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch today’s appointments:', err);
    }
  };

  useEffect(() => {
    fetchTodaysAppointments();
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: 'calc(100% - 240px)',
          left: '240px',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#ffffff',
          color: '#111827',
          borderBottom: '1px solid #e5e7eb',
          height: '64px',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
          {/* Search */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              backgroundColor: '#f3f4f6',
              px: 2,
              py: 0.5,
              borderRadius: 1,
              width: { xs: '100%', sm: 320 },
            }}
          >
            <Search fontSize="small" className="text-gray-500" />
            <InputBase
              placeholder="Search..."
              className="text-sm w-full"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Box>

          {/* Icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton size="small" onClick={toggleModal}>
              <Badge badgeContent={unread ? appointments.length : 0} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
              <span className="text-sm text-gray-700 font-medium hidden sm:inline">Admin</span>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Appointment Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Today's Appointments</DialogTitle>
        <DialogContent>
          {appointments.length > 0 ? (
            <List>
              {appointments.map((appt: any, i: number) => (
                <ListItem key={i} divider>
                  <ListItemText
                    primary={`${appt.patientName} with Dr. ${appt.doctorName}`}
                    secondary={`Time: ${new Date(appt.date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <p className="text-gray-600">No appointments for today.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
