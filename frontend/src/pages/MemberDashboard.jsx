import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MemberModals } from "../components/MemberModals.jsx";
import dayjs from "dayjs";
import { Spin, Dropdown } from "antd";
import { NotificationDropdown } from "../components/NotificationDropdown.jsx";

export const MemberDashboard = () => {
  let { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/member/${id}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const autoRefresh = () => {
    fetchData(); // Trigger data fetch when booking is confirmed
    // console.log("should refresh")
  };

  const pendingCount = data
    ? data.filter((appointment) => appointment.status === "Pending").length
    : 0;

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {loading ? (
        <div className="flex justify-center items-center w-full">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex w-full h-full overflow-hidden transition-opacity duration-5000 opacity-100">
          {/* Sidebar */}
          <div className="w-64 bg-gradient-to-r from-blue-900 to-blue-700 text-white flex flex-col h-full">
            <div className="p-4 text-center text-2xl font-bold">Dashboard</div>
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
                <span className="ml-2">Profile</span>
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
                <span className="ml-2">Settings</span>
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
             
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col h-full overflow-y-auto">
            {/* Header */}
            <header className="bg-white shadow p-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <div className="text-gray-600">
                  Hi {data[0].member_name}, You have {pendingCount} pending
                  appointments
                </div>
                
                <NotificationDropdown userId={id} userType="member" />
              </div>
            </header>

            {/* Content */}
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
                          Request on
                        </th>
                        <th className="py-3 px-4 border-b text-left text-gray-600">
                          Booking Type
                        </th>
                        <th className="py-3 px-4 border-b text-left text-gray-600">
                          Specialist
                        </th>
                        <th className="py-3 px-4 border-b text-left text-gray-600">
                          Confirmed on
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
                          Payment
                        </th>
                        <th className="py-3 px-4 border-b text-left text-gray-600">
                          Action
                        </th>
                      </tr>
                    </thead>
                    {!data[0].request_date ? (
                      <tbody>
                        <tr className="w-full">
                          <td
                            colSpan="4"
                            className="py-4 px-4 border-b text-center text-red-500 font-bold text-lg w-full"
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
                              {appointment.booking_type || ""}
                            </td>
                            <td className="py-3 px-4 border-b">
                              {appointment.specialist_type || ""}
                            </td>
                            <td className="py-3 px-4 border-b">
                              {appointment.confirmed_date
                                ? dayjs(appointment.confirmed_date).format(
                                    "D MMMM, YYYY"
                                  )
                                : "_________________"}
                            </td>
                            <td className="text-center py-3 px-4 border-b">
                              {appointment.confirmed_date
                                ? appointment.confirmed_time
                                : "_________________"}
                            </td>
                           
                            <td className="py-3 px-4 border-b">
                            {appointment.payment_method || "________"}
                            </td>
                            <td className="py-3 px-4 border-b">
                              {appointment.status || ""}
                            </td>
                            <td className="py-3 px-4 border-b">
                              {appointment.payment_status}
                            </td>
                            <td className="py-3 px-4 border-b">
                              <div className="flex items-center justify-center">
                                <MemberModals
                                  memberId={id}
                                  memberName={data[0].member_name}
                                  phoneNumber={data[0].cell}
                                  memberEmail={data[0].email}
                                  autoRefresh={autoRefresh}
                                  role_id ={data[0].role_id}
                                  modalType={"More Actions"}
                                  payment_method={appointment.payment_method}
                                  specialistName={appointment.specialist_name}
                                  invoice_status={appointment.invoice_status}
                                  specialistId={appointment.specialist_id}
                                  AppointmentId={appointment.appointment_id}
                                  confirmed_date={appointment.confirmed_date ? dayjs(appointment.confirmed_date).format('D MMMM, YYYY') : "________"}
                                  confirmed_time={appointment.confirmed_time ? appointment.confirmed_time: "________"}
                                  credits_used={appointment.credits_used}
                                  appointmentStatus={appointment.status}
                                  specialistType={appointment.specialist_type}
                                  booking_type={appointment.booking_type}
                                  booked_by={appointment.booked_by}
                                  notes_status={appointment.notes_status}
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

          {/* User Profile */}
          <div className="bg-white p-6 rounded-lg shadow-lg m-4 w-64 max-h-96 transform transition duration-500 hover:scale-105">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img
                  className="object-cover object-center h-24 w-24 rounded-full border-4 border-blue-500 shadow-lg"
                  src="/kwenprofile1.jpg"
                  alt="User Avatar"
                />
                <svg
                  className="absolute bottom-0 right-0 w-6 h-6 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {data[0].member_name}
              </h2>
              <p className="text-gray-600">Member</p>
            </div>
            <div className="mt-4 text-gray-600">
              <div className="flex items-center justify-between">
                <strong>Joined Date</strong>
                <span>{formatDate(data[0].joined_date)}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <strong>Appointments</strong>
                <span>{pendingCount}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <strong>SSISA Credits</strong>
                <span>{data[0].credits}</span>
              </div>
              <div className="mt-4">
                <MemberModals
                  memberId={id}
                  memberName={data[0].member_name}
                  memberCredits={data[0].credits}
                  autoRefresh={autoRefresh}
                  modalType={"Book"}
                  
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};