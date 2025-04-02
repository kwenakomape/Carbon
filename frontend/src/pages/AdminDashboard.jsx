import useLoading from "../utils/hooks/useLoading.js";

import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { AdminModals } from "../components/AdminModals.jsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import the UTC plugin
import relativeTime from "dayjs/plugin/relativeTime";
import {
  BellIcon,
  SettingsIcon,
  ArrowRightIcon,
} from "../components/icons/Icons.jsx";
import { getNotificationMeta } from "../utils/notificationUtils.jsx";

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const AdminDashboard = () => {
  let { id } = useParams();
  const [data, setData] = useState(null);
  const loading = useLoading();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Ref for the dropdown and notification icon
  const dropdownRef = useRef(null);
  const notificationIconRef = useRef(null);

  // Fetch notifications from the backend
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/notifications/${id}`);
      console.log("Fetched notifications:", response.data); // Debugging
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Mark all notifications as seen when the notification icon is clicked
  const markAllAsSeen = async () => {
    try {
      await axios.patch(`/api/notifications/mark-all-seen/${id}`);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, seen_status: true }))
      );
      console.log("Marked all as seen. Updated notifications:", notifications); // Debugging
    } catch (error) {
      console.error("Error marking notifications as seen:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.patch(`/api/notifications/mark-all-read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_status: true }))
      );
      console.log("Marked all as read. Updated notifications:", notifications); // Debugging
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read/${id}`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notificationId ? { ...n, read_status: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        notificationIconRef.current &&
        !notificationIconRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle notification icon click
  const handleNotificationIconClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markAllAsSeen(); // Mark all notifications as seen when the dropdown is opened
    }
  };

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
              <div className="flex items-center space-x-4">
                {/* Notification Icon */}
                <div className="relative">
                  <button
                    ref={notificationIconRef}
                    onClick={handleNotificationIconClick}
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
                    {notifications.some((n) => !n.seen_status) && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {notifications.filter((n) => !n.seen_status).length}
                      </span>
                    )}
                  </button>
                  <div
                    ref={dropdownRef}
                    className={`absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl z-50 transition-all duration-200 ease-in-out transform ${
                      showNotifications
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                    style={{
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.12)",
                      border: "1px solid rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    {/* Header with clear action buttons */}
                    <div className="sticky top-0 p-4 bg-white border-b border-gray-100 rounded-t-xl flex justify-between items-center backdrop-blur-sm bg-opacity-90">
                      <div className="flex items-center">
                        <h3 className="font-semibold text-gray-900 text-base">
                          Notifications
                        </h3>
                        {notifications.some((n) => !n.read_status) && (
                          <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {notifications.filter((n) => !n.read_status).length}{" "}
                            new
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {notifications.length > 0 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAllAsRead();
                              }}
                              className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded hover:bg-blue-50"
                            >
                              Mark all read
                            </button>
                            <button className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors px-2 py-1 rounded hover:bg-gray-100">
                              <SettingsIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[480px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 flex flex-col items-center justify-center text-center">
                          <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                            <BellIcon className="h-6 w-6 text-gray-400" />
                          </div>
                          <h4 className="text-sm font-medium text-gray-700 mb-1">
                            No notifications
                          </h4>
                          <p className="text-xs text-gray-500">
                            You're all caught up
                          </p>
                        </div>
                      ) : (
                        notifications.map((notification) => {
                          const member = data.find(
                            (item) => item.member_id === notification.member_id
                          );
                          const notificationMeta =
                            getNotificationMeta(notification);

                          return (
                            <div
                              key={notification.notification_id}
                              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                                !notification.read_status
                                  ? "bg-blue-50/30"
                                  : "bg-white"
                              }`}
                              onClick={() =>
                                markAsRead(notification.notification_id)
                              }
                            >
                              <div className="flex items-start gap-3">
                                {/* Profile Avatar with Status */}
                                <div className="flex-shrink-0 relative">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                    {member?.member_name ? (
                                      <span className="font-medium text-blue-600">
                                        {member.member_name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </span>
                                    ) : (
                                      <UserIcon className="h-5 w-5 text-blue-500" />
                                    )}
                                  </div>
                                  <div
                                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${notificationMeta.statusColor}`}
                                  >
                                    {notificationMeta.statusIcon}
                                  </div>
                                </div>

                                {/* Notification Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3
                                        className={`text-sm font-medium ${notificationMeta.textColor}`}
                                      >
                                        {notificationMeta.title}
                                      </h3>
                                      <p className="text-sm text-gray-800 mt-1">
                                        <span className="font-medium">
                                          {member?.member_name || "Member"}
                                        </span>
                                        <span className="text-gray-500 ml-1.5 text-xs">
                                          {/* (ID:{" "}
                                          {
                                            notification.message.split(
                                              "member ID "
                                            )[1]
                                          }
                                          ) */}
                                        </span>
                                      </p>
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                      {dayjs
                                        .utc(notification.timestamp)
                                        .utcOffset(2)
                                        .fromNow()}
                                    </span>
                                  </div>

                                  {/* Contextual Details */}
                                  {notification.notification_type ===
                                    "Rescheduling" &&
                                    member?.confirmed_date && (
                                      <div className="mt-2 flex items-center text-xs text-gray-500">
                                        <ClockIcon className="h-3.5 w-3.5 mr-1.5" />
                                        <span>
                                          Previously:{" "}
                                          {dayjs(member.confirmed_date).format(
                                            "MMM D [at] h:mm A"
                                          )}
                                        </span>
                                      </div>
                                    )}

                                  {/* Action Buttons */}
                                  <div className="mt-3 flex gap-2">
                                    <button
                                      className="text-xs font-medium bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Handle view action
                                      }}
                                    >
                                      View details
                                    </button>
                                    {notification.notification_type ===
                                      "StandardBooking" && (
                                      <button
                                        className="text-xs font-medium bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Handle confirm action
                                        }}
                                      >
                                        Confirm
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Unread Indicator */}
                                {!notification.read_status && (
                                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-3"></div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="sticky bottom-0 p-3 border-t border-gray-100 bg-white rounded-b-xl text-center">
                        <a
                          href="#"
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center"
                        >
                          View all notifications
                          <ArrowRightIcon className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                {/* Profile Section */}
                <div className="flex items-center space-x-2">
                  {/* Admin Name */}
                  <span className="text-sm text-gray-800 font-medium">
                    {data[0].admin_name}
                  </span>
                  {/* Profile Icon */}
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {data[0].admin_name.charAt(0)}
                  </div>
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
