import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { MemberModals } from '../components/MemberModals';
import { Spin, Avatar, Badge, Tag } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import { UserOutlined, BellOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

export const MemberDashboard = () => {
  const { id } = useParams();
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchMemberData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/member/${id}`);
      if (response.data.success) {
        setMemberData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch member data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching member data:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMemberData();
  }, [fetchMemberData]);

  const handleRefresh = useCallback(() => {
    fetchMemberData();
  }, [fetchMemberData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">No member data found</div>
      </div>
    );
  }

  const pendingCount = memberData.appointments?.filter(
    app => app.status === 'Pending'
  ).length || 0;

  const SidebarItem = ({ icon, label, active = false }) => (
    <div className={`flex items-center px-4 py-3 mt-2 text-sm font-semibold rounded-lg transition-colors ${active ? 'bg-blue-800 text-white' : 'text-white hover:bg-blue-600'}`}>
      {icon}
      <span className="ml-3">{label}</span>
    </div>
  );

  const AppointmentStatusBadge = ({ status }) => {
    const statusColors = {
      'Pending': 'orange',
      'Confirmed': 'blue',
      'Seen': 'green',
      'Cancelled': 'red',
      'Rescheduled': 'purple',
      'Scheduled': 'cyan',
      'Missed': 'volcano'
    };
    return <Tag color={statusColors[status]}>{status}</Tag>;
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-r from-blue-900 to-blue-700 text-white flex flex-col h-full">
        <div className="p-4 text-center text-2xl font-bold">Dashboard</div>
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <SidebarItem 
            icon={<BellOutlined />} 
            label="Dashboard" 
            active 
          />
          <SidebarItem 
            icon={<UserOutlined />} 
            label="Profile" 
          />
          <SidebarItem 
            icon={<SettingOutlined />} 
            label="Settings" 
          />
          <SidebarItem 
            icon={<LogoutOutlined />} 
            label="Logout" 
          />
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="text-gray-600">
              Hi {memberData.name}, You have {pendingCount} pending appointments
            </div>
            
          </div>
        </header>

        <main className="flex-1 p-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Appointments
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 border-b text-left text-gray-600">Request on</th>
                    <th className="py-3 px-4 border-b text-left text-gray-600">Booking Type</th>
                    <th className="py-3 px-4 border-b text-left text-gray-600">Specialist</th>
                    <th className="py-3 px-4 border-b text-left text-gray-600">Confirmed on</th>
                    <th className="py-3 px-4 border-b text-left text-gray-600">Appointment Time</th>
                    <th className="py-3 px-4 border-b text-left text-gray-600">Payment Type</th>
                    <th className="py-3 px-4 border-b text-left text-gray-600">Status</th>
                    <th className="py-3 px-4 border-b text-left text-gray-600">Payment</th>
                    <th className="py-3 px-4 border-b text-left text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(!memberData.appointments || memberData.appointments.length === 0) ? (
                    <tr>
                      <td colSpan="9" className="py-4 px-4 border-b text-center text-gray-500">
                        You have no appointments
                      </td>
                    </tr>
                  ) : (
                    memberData.appointments.map((appointment) => (
                      <tr
                        key={appointment.appointment_id}
                        id={`appointment-${appointment.appointment_id}`}
                        className="hover:bg-gray-100"
                        
                      >
                        <td className="py-3 px-4 border-b">
                          {appointment.request_date ? dayjs(appointment.request_date).format('D MMMM, YYYY') : '-'}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {appointment.booking_type || '-'}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {appointment.specialist_type || '-'}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {appointment.confirmed_date ? dayjs(appointment.confirmed_date).format('D MMMM, YYYY') : '-'}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {appointment.confirmed_time || '-'}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {appointment.payment_method || '-'}
                        </td>
                        <td className="py-3 px-4 border-b">
                          <AppointmentStatusBadge status={appointment.status} />
                        </td>
                        <td className="py-3 px-4 border-b">
                          {appointment.payment_status}
                        </td>
                        <td className="py-3 px-4 border-b">
                          <div className="flex justify-center">
                            <MemberModals
                              memberId={id}
                              memberName={memberData.name}
                              phoneNumber={memberData.cell}
                              memberEmail={memberData.email}
                              autoRefresh={handleRefresh}
                              role_id={memberData.role_id}
                              modalType="More Actions"
                              {...appointment}
                              confirmed_date={
                                appointment.confirmed_date
                                  ? dayjs(appointment.confirmed_date).format('D MMMM, YYYY')
                                  : '-'
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Profile Sidebar */}
      <div className="bg-white p-6 rounded-lg shadow-lg m-4 w-64 max-h-96 transform transition duration-500 hover:scale-105">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Avatar 
              size={96} 
              icon={<UserOutlined />} 
              src="/kwenprofile1.jpg"
              className="border-4 border-blue-500 shadow-lg"
            />
            <Badge 
              dot 
              color="green" 
              className="absolute bottom-0 right-0 w-6 h-6" 
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {memberData.name}
          </h2>
          <p className="text-gray-600">Member</p>
        </div>
        <div className="mt-4 text-gray-600">
          <div className="flex items-center justify-between">
            <strong>Joined Date</strong>
            <span>{dayjs(memberData.joined_date).format('D MMMM, YYYY')}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <strong>Appointments</strong>
            <span>{memberData.appointments?.length || 0}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <strong>Credits</strong>
            <span>{memberData.credits}</span>
          </div>
          <div className="mt-4">
            <MemberModals
              memberId={id}
              memberName={memberData.name}
              memberCredits={memberData.credits}
              autoRefresh={handleRefresh}
              modalType="Book"
            />
          </div>
        </div>
      </div>
    </div>
  );
};