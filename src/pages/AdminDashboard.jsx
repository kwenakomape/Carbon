import {
  Card,
  Icon,
  Button,
  Form,
  Popup,
  Divider,
  Dropdown,
  Input,
  HeaderContent,
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Checkbox,
  Header,
  Table,
  Segment,
  FormField,
} from "semantic-ui-react";
import useLoading from "../js/useLoading.js";
import { LoaderExampleText } from "../components/loader.jsx";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AdminModals } from "../components/AdminModals.jsx";

export const AdminDashboard = () => {
  let { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading, resetLoading] = useLoading();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/appointments-with-specialist/${id}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, setLoading]);
  const pendingCount = data
    ? data.filter((appointment) => appointment.Status === "Pending").length
    : 0;

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
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
            {/* <Button
                positive
                icon=""
                labelPosition="right"
                content="LOG OUT"
                type="submit"
              /> */}
          </Segment>
          <div className="admindashbaord-center-panel">
            <Segment id="headingMessageAdmin">
              Welcome <strong>{data[0].Specialist_Name} </strong>
            </Segment>
            <Table celled>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Client</TableHeaderCell>
                  <TableHeaderCell>Payment Method</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((appointment, index) => (
                  <TableRow key={index}>
                    
                    <TableCell collapsing> {appointment.Date ? formatDate(appointment.Date) : "______________"} </TableCell>
                    <TableCell>{appointment.Member_Name}</TableCell>
                    <TableCell collapsing>
                      cash
                    </TableCell>
                    <TableCell collapsing>
                      <div className="status-container">
                        <span>{appointment.Status}</span>
                        <span>
                          
                          <AdminModals memberId={data[index].Member_Id} />
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
};
