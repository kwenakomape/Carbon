import useLoading from "../utils/hooks/useLoading.js";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AdminModals } from "../components/AdminModals.jsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime)
export const AdminDashboard = () => {
  let { id } = useParams();
  const [data, setData] = useState(null);
  const loading = useLoading();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications");
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `/api/appointments-with-specialist/${id}`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const autoRefresh = () => {
    fetchData(); // Trigger data fetch when booking is confirmed
  };
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="flex h-screen bg-gray-100 font-sans">
          <div className="w-64 bg-gradient-to-r from-blue-900 to-blue-700 text-white flex flex-col h-full">
            <div className="p-4 text-center text-2xl font-bold">
              Admin Dashboard
            </div>
            <nav className="flex-1 px-2 py-4 overflow-y-auto">
              <a className="block px-4 py-2 mt-2 text-sm font-semibold bg-blue-800 rounded-lg hover:bg-blue-600 transition duration-300">
                <svg
                  className="w-6 h-6 inline-block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
                <span className="ml-2">Dashboard</span>
              </a>
              <a className="block px-4 py-2 mt-2 text-sm font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
                <svg
                  className="w-6 h-6 inline-block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span className="ml-2">Appointments</span>
              </a>
              <a className="block px-4 py-2 mt-2 text-sm font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
                <svg
                  className="w-6 h-6 inline-block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3"
                  ></path>
                </svg>
                <span className="ml-2">Members</span>
              </a>
              <a className="block px-4 py-2 mt-2 text-sm font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
                <svg
                  className="w-6 h-6 inline-block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                <span className="ml-2">Logout</span>
              </a>
              <a className="block px-4 py-2 mt-2 text-sm font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
                <span className="ml-2">Notes</span>
              </a>
            </nav>
          </div>

          <div className="flex-1 flex flex-col h-full overflow-y-auto">
            <header className="bg-white shadow p-4 flex justify-between items-center w-full">
              <h1 className="text-2xl font-bold text-gray-800">
                Admin Dashboard
              </h1>
              <div className="relative">
                {/* Notification Icon */}
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    ></path>
                  </svg>
                  {/* Notification Badge */}
                  {notifications.some((n) => !n.read) && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="p-4 font-semibold text-gray-800 border-b">
                      Notifications
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-gray-600 text-center">
                          No new notifications.
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? "bg-gray-100" : ""
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="text-sm text-gray-800">
                              {notification.message}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {dayjs(notification.timestamp).fromNow()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-4 text-center text-sm text-blue-600 hover:underline cursor-pointer">
                      Mark all as read
                    </div>
                  </div>
                )}
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
                        <th className="py-3 px-4 border-b text-left text-gray-600">
                          Request On
                        </th>
                        <th className="py-3 px-4 border-b text-left text-gray-600">
                          Client Name
                        </th>
                        <th className="py-3 px-4 border-b text-left text-gray-600">
                          Booking Type
                        </th>
                        <th className="py-3 px-4 border-b text-left text-gray-600">
                          Confirmed On
                        </th>
                        <th className="py-3 px-4 border-b text-left text-gray-600">
                          Appointment Time
                        </th>
                        <th className="py-3 px-4 border-b text-left text-gray-600">
                          Payment Type
                        </th>
                        <th className="py-3 px-4 border-b text-left text-gray-600">
                          Status
                        </th>
                        <th className="py-3 px-4 border-b text-left text-gray-600">
                          Invoice
                        </th>
                        <th className="py-3 px-4 border-b text-left text-gray-600">
                          Payment
                        </th>

                        {/* <th className="py-3 px-4 border-b text-left text-gray-600">
                          Clinical Notes
                        </th> */}
                        <th className=" text-center py-3 px-4 border-b  text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    {!data[0].request_date ? (
                      <tbody>
                        <tr>
                          <td
                            colSpan="6"
                            className="py-4 px-4 border-b text-center text-red-500 font-bold text-lg"
                          >
                            You have No Appointments
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {data.map((appointment, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-100 transition duration-300"
                          >
                            <td className="py-3 px-4 border-b">
                              {appointment.request_date
                                ? dayjs(appointment.request_date).format(
                                    "D MMMM, YYYY"
                                  )
                                : ""}
                            </td>
                            <td className="py-3 px-4 border-b">
                              {appointment.member_name || ""}
                            </td>
                            <td className="py-3 px-4 border-b">
                              {appointment.booking_type || ""}
                            </td>
                            <td className="py-3 px-4 border-b">
                              {appointment.confirmed_date
                                ? dayjs(appointment.confirmed_date).format(
                                    "D MMMM, YYYY"
                                  )
                                : "________"}
                            </td>
                            <td className="py-3 px-4 border-b">
                              {appointment.confirmed_time
                                ? appointment.confirmed_time
                                : "________"}
                            </td>
                            <td className="text-center py-3 px-4 border-b">
                              {appointment.payment_method || "________"}
                            </td>
                            <td className="py-3 px-4 border-b">
                              <div className="flex items-center">
                                <span>{appointment.status || ""}</span>
                                {appointment.status !== "Seen" &&
                                  appointment.status !== "Missed" && (
                                    <span className="ml-2 relative">
                                      <button className="text-gray-600 hover:text-gray-900 focus:outline-none"></button>
                                    </span>
                                  )}
                              </div>
                            </td>
                            <td className="py-3 px-4 border-b">
                              {appointment.invoice_status}
                            </td>
                            <td className="py-3 px-4 border-b">
                              {appointment.payment_status}
                            </td>

                            {/* <td className="py-3 px-4 border-b">
                              {appointment.notes_status}
                            </td> */}
                            <td className="py-3 px-4 border-b">
                              <div className="flex items-center justify-center">
                                <AdminModals
                                  memberId={appointment.member_id}
                                  memberName={appointment.member_name}
                                  memberEmail={appointment.email}
                                  memberCredits={data[0].credits}
                                  booking_type={appointment.booking_type}
                                  booked_by={appointment.booked_by}
                                  payment_method={appointment.payment_method}
                                  AppointmentId={appointment.appointment_id}
                                  specialistId={appointment.specialist_id}
                                  notes_status={appointment.notes_status}
                                  role_id={data[0].role_id}
                                  phoneNumber={appointment.cell}
                                  credits_used={appointment.credits_used}
                                  appointmentStatus={appointment.status}
                                  specialistType={appointment.specialist_type}
                                  invoice_status={appointment.invoice_status}
                                  admin_name={appointment.admin_name}
                                  preferred_date1={
                                    appointment.preferred_date1
                                      ? dayjs(
                                          appointment.preferred_date1
                                        ).format("D MMMM, YYYY")
                                      : ""
                                  }
                                  preferred_time_range1={
                                    appointment.preferred_time_range1 || ""
                                  }
                                  preferred_date2={
                                    appointment.preferred_date2
                                      ? dayjs(
                                          appointment.preferred_date2
                                        ).format("D MMMM, YYYY")
                                      : ""
                                  }
                                  preferred_time_range2={
                                    appointment.preferred_time_range2 || ""
                                  }
                                  preferred_date3={
                                    appointment.preferred_date3
                                      ? dayjs(
                                          appointment.preferred_date3
                                        ).format("D MMMM, YYYY")
                                      : ""
                                  }
                                  preferred_time_range3={
                                    appointment.preferred_time_range3 || ""
                                  }
                                  autoRefresh={autoRefresh}
                                  specialistName={data[0].specialist_name}
                                  confirmed_date={
                                    appointment.confirmed_date
                                      ? dayjs(
                                          appointment.confirmed_date
                                        ).format("D MMMM, YYYY")
                                      : "________"
                                  }
                                  confirmed_time={
                                    appointment.confirmed_time
                                      ? appointment.confirmed_time
                                      : "________"
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
};
