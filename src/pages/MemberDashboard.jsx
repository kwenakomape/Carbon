import {
  Icon,
  HeaderContent,
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Header,
  Table,
  Segment,
} from "semantic-ui-react";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MemberModals } from "../components/MemberModals.jsx";
import dayjs from "dayjs";
import { AlertDialogDemo } from "../components/AlertDialog.jsx";
import { Spin } from "antd";
import useLoading from "../hooks/useLoading";

export const MemberDashboard = () => {
  let { id } = useParams();
  const [data, setData] = useState(null);
  const loading = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/member/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const pendingCount = data
    ? data.filter((appointment) => appointment.status === "Pending").length
    : 0;

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100 font-sans">
      {loading ? (
        <div className="flex justify-center items-center w-full">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="flex w-full h-full overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gradient-to-r from-blue-900 to-blue-700 text-white flex flex-col h-full">
            <div className="p-4 text-center text-2xl font-bold">Dashboard</div>
            <nav className="flex-1 px-2 py-4 overflow-y-auto">
              <a className="block px-4 py-2 mt-2 text-sm font-semibold bg-blue-800 rounded-lg hover:bg-blue-600 transition duration-300">
                <svg className="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
                <span className="ml-2">Dashboard</span>
              </a>
              <a className="block px-4 py-2 mt-2 text-sm font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
                <svg className="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="ml-2">Profile</span>
              </a>
              <a className="block px-4 py-2 mt-2 text-sm font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
                <svg className="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"></path>
                </svg>
                <span className="ml-2">Settings</span>
              </a>
              <a className="block px-4 py-2 mt-2 text-sm font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
                <svg className="w-6 h-6 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
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
                  Hi {data[0].member_name}, You have {pendingCount} pending appointments
                </div>
                <button className="relative">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                  <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                </button>
              </div>
            </header>

            {/* Content */}
            <main className="flex-1 p-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Appointments</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 border-b text-left text-gray-600">Request Date</th>
                        <th className="py-3 px-4 border-b text-left text-gray-600">Specialist</th>
                        <th className="py-3 px-4 border-b text-left text-gray-600">Confirmed Date</th>
                        <th className="py-3 px-4 border-b text-left text-gray-600">Status</th>
                      </tr>
                    </thead>
                    {!data[0].request_date ? (
                      <tbody>
                        <tr>
                          <td
                            colSpan="4"
                            className="py-4 px-4 border-b text-center text-red-500 font-bold text-lg"
                          >
                            You have No Appointments
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {data.map((appointment, index) => (
                          <tr key={index} className="hover:bg-gray-100 transition duration-300">
                            <td className="py-3 px-4 border-b">
                              {appointment.request_date
                                ? dayjs(appointment.request_date).format('D MMMM, YYYY')
                                : ''}
                            </td>
                            <td className="py-3 px-4 border-b">{appointment.specialist_type || ''}</td>
                            <td className="py-3 px-4 border-b">
                              {appointment.confirmed_date
                                ? dayjs(appointment.confirmed_date).format('D MMMM, YYYY')
                                : '___________________________________________'}
                            </td>
                            <td className="py-3 px-4 border-b">{appointment.status || ''}</td>
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
          <div className="bg-white p-6 rounded-lg shadow m-4 w-64 max-h-96 overflow-auto">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z"></path>
              </svg>
              <h2 className="text-2xl font-bold text-gray-800">{data[0].member_name}</h2>
            </div>
            <div className="mt-4 text-gray-600">
              <div>
                <strong>Joined Date</strong> : {formatDate(data[0].joined_date)}
              </div>
              <div>
                <strong>Appointment</strong> : {pendingCount}
              </div>
              <div><strong>SSISA Credits</strong> : {data[0].credits}
              </div>
              <br />
              <br />
              <MemberModals memberId={id} memberName={data[0].member_name} memberCredits={data[0].credits} />
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};
