import useLoading from "../utils/hooks/useLoading.js";

import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { AdminModals } from "../components/AdminModals.jsx";
import dayjs from "dayjs";
import { NotificationDropdown } from "../components/NotificationDropdown.jsx";

export const AdminDashboard = () => {
  let { id } = useParams();
  const [data, setData] = useState(null);
  const loading = useLoading();

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
              <NotificationDropdown userId={id} userData={data} />
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
