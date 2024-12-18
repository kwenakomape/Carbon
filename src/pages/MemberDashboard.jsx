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
import { Spin } from 'antd';
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
          <div className="userdashboard-center-panel">
            <Segment id="headingMessage">
              Hi {data[0].member_name}, You have {pendingCount} pending
              appointments
            </Segment>
            <Table celled padded>
              <div className="userTable"></div>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Request Date</TableHeaderCell>
                  <TableHeaderCell>Specialist</TableHeaderCell>
                  <TableHeaderCell>Confirmed Date</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHeader>
              {!data[0].request_date ? (
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan="4"
                      textAlign="center"
                      style={{
                        fontSize: "1.5em",
                        fontWeight: "bold",
                        color: "red",
                      }}
                    >
                      You have No Appointments
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>
                  {data.map((appointment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {appointment.request_date
                          ? dayjs(appointment.request_date).format(
                              "D MMMM, YYYY"
                            )
                          : ""}
                      </TableCell>
                      <TableCell>{appointment.specialist_type || ""}</TableCell>
                      <TableCell>
                        {appointment.confirmed_date
                          ? dayjs(appointment.confirmed_date).format(
                              "D MMMM, YYYY"
                            )
                          : "___________________________________________"}
                      </TableCell>
                      <TableCell>{appointment.status || ""}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              )}
            </Table>
          </div>
          <Segment className="userProfile">
            <Header as="h2" icon textAlign="center">
              <Icon name="user" circular />
              <HeaderContent>{data[0].member_name}</HeaderContent>
            </Header>
            <HeaderContent>
              <div>
                <strong>Joined Date</strong> : {formatDate(data[0].joined_date)}
              </div>
              <div>
                <strong>Appointment</strong> : {pendingCount}
              </div>
              <div>
                <strong>SSISA Credits</strong> : {data[0].credits}
              </div>
              <br />
              <br />
              <MemberModals memberId={id} memberName={data[0].member_name} memberCredits={data[0].credits} />
            </HeaderContent>
          </Segment>
        </div>
      )}
    </>
  );
};