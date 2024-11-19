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
import useLoading from "../js/useLoading.js";
import { LoaderExampleText } from "../components/loader.jsx";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {MemberModals} from "../components/MemberModals.jsx";

export const MemberDashboard = () => {
  let { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading, resetLoading] = useLoading();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/member/${id}`);
        setData(response.data);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, setLoading]);
  const pendingCount = data ? data.filter(appointment => appointment.Status === 'Pending').length : 0;

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };
  return (
    <>
      {loading ? (
        <LoaderExampleText loadingMessage="Dashboard Loading..." />
      ) : (
        <div className="userDashbaord">
          <Segment className="left-sidebar">
            <div className="left-siber-options">
              <span>
                <a className="item">
                  <Icon name="th large" />
                </a>
                <span>Dashboard</span>
              </span>
            </div>
          </Segment>
          <div className="userdashbaord-center-panel">
            <Segment id="headingMessage">
              Hi {data[0].Member_Name}, You have {pendingCount} pending appointments
            </Segment>
            <Table celled padded>
              <div className="userTable"></div>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Specialist</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((appointment, index) => (
                  <TableRow key={index}>
                    
                    <TableCell> {appointment.Date ? formatDate(appointment.Date) : "______________"} </TableCell>
                    <TableCell>
                      {appointment.Specialization}
                    </TableCell>
                    <TableCell>{appointment.Status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Segment className="userProfile">
            <Header as="h2" icon textAlign="center">
              <Icon name="user" circular />
              <HeaderContent>{data[0].Member_Name}</HeaderContent>
            </Header>
            <HeaderContent>
              <div>
                <strong>Joined Date</strong> : {formatDate(data[0].Joined_Date)}
              </div>
              <div>
                <strong>Appointment</strong> : {pendingCount}
              </div>
              <div>
                <strong>SSISA Credits</strong> : {data[0].Points}
              </div>
              <br />
              <br />
              <MemberModals memberId={id} memberName={data[0].Member_Name} />
            </HeaderContent>
          </Segment>
        </div>
      )}
    </>
  );
};
