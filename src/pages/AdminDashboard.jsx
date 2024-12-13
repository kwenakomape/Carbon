import {
  Card,
  Icon,
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Table,
  Segment,
} from "semantic-ui-react";

import { Spin } from 'antd';
import useLoading from "../hooks/useLoading";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AdminModals } from "../components/AdminModals.jsx";
import dayjs from "dayjs";

export const AdminDashboard = () => {
  let { id } = useParams();
  const [data, setData] = useState(null);
  const loading = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/appointments-with-specialist/${id}`
        );
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      {loading ? (
        <Spin size="large" />
      ) : (
        <div className="userDashboard">
          <Segment className="left-sidebar">
            <div className="left-sidebar-options">
              <span>
                <a className="item">
                  <Icon name="th large" />
                </a>
                <span>Dashboard</span>
              </span>
            </div>
          </Segment>
          <div className="admindashboard-center-panel">
            <Segment id="headingMessageAdmin">
              Welcome <strong>{data[0].specialist_name}</strong>
            </Segment>
            <Table celled>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Request Date</TableHeaderCell>
                  <TableHeaderCell>Client</TableHeaderCell>
                  <TableHeaderCell>Payment Method</TableHeaderCell>
                  <TableHeaderCell>Confirmed Date</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHeader>
              {!data[0].request_date ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan="5" textAlign="center" style={{ fontSize: '1.5em', fontWeight: 'bold', color: 'red' }}>
                      You have No Appointments
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {data.map((appointment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {appointment.request_date ? dayjs(appointment.request_date).format('D MMMM, YYYY') : ""}
                      </TableCell>
                      <TableCell>{appointment.member_name || ""}</TableCell>
                      <TableCell>{appointment.payment_method || "___________________________________________"}</TableCell>
                      <TableCell>
                        {appointment.confirmed_date ? dayjs(appointment.confirmed_date).format('D MMMM, YYYY') : "___________________________________________"}
                      </TableCell>
                      <TableCell collapsing>
                        <div className="status-container">
                          <span>{appointment.status || ""}</span>
                          {(appointment.status !== "Seen" && appointment.status !== "Missed") && (
                            <span>
                              <AdminModals
                                memberId={appointment.member_id}
                                memberName={appointment.member_name}
                                AppointmentId={appointment.appointment_id}
                                phoneNumber={appointment.cell}
                                appointmentStatus={appointment.status}
                                total_credits_used={appointment.total_credits_used}
                                total_amount={appointment.total_amount}
                                preferred_date1={appointment.preferred_date1 ? dayjs(appointment.preferred_date1).format('D MMMM, YYYY') : ""}
                                preferred_time_range1={appointment.preferred_time_range1 || ""}
                                preferred_date2={appointment.preferred_date2 ? dayjs(appointment.preferred_date2).format('D MMMM, YYYY') : ""}
                                preferred_time_range2={appointment.preferred_time_range2 || ""}
                                preferred_date3={appointment.preferred_date3 ? dayjs(appointment.preferred_date3).format('D MMMM, YYYY') : ""}
                                preferred_time_range3={appointment.preferred_time_range3 || ""}
                              />
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
        </div>
      )}
    </>
  );
};