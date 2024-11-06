
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
  import useLoading from '../js/useLoading.js'
  import { LoaderExampleText } from "../components/loader.jsx";
export const Dashboard = () => {
  const [loading] = useLoading();
  return (
    <>
      {loading ? (
        <LoaderExampleText loadingMessage="Dashboard Loading..." />
      ) : (<div className="userDashbaord">
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
            Hi August Bhila, You have 2 pending appointments
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
              <TableRow>
                <TableCell>24/12/2024</TableCell>
                <TableCell>Biokineticist</TableCell>
                <TableCell>Attendend</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>14/11/2024</TableCell>
                <TableCell>Dietitian</TableCell>
                <TableCell>Missed</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>16/11/2024</TableCell>
                <TableCell>Biokineticist</TableCell>
                <TableCell>Pending</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>16/11/2024</TableCell>
                <TableCell>Biokineticist</TableCell>
                <TableCell>Pending</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <Segment className="userProfile">
          <Header as="h2" icon textAlign="center">
            <Icon name="user" circular />
            <HeaderContent>August</HeaderContent>
          </Header>
          <HeaderContent>
            <div>
              <strong>Joined Date</strong> : 14/05/2024
            </div>
            <div>
              <strong>Appointment</strong> : 2
            </div>
            <div>
              <strong>SSISA Credits</strong> : 125
            </div>
            <br />
            <br />
            <Button
              positive
              //   icon="chevron right"
              //   labelPosition="right"
              content="BOOK APPOINTMENT"
              type="submit"
            />
          </HeaderContent>
        </Segment>
      </div>)}
    </>
  );
};