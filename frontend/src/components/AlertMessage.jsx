import { Alert } from "antd";
import { NoteAlert } from "./Alert/NoteAlert";
import { ReminderAlert } from "./Alert/ReminderAlert";

export const AlertMessage = () => {
  return (
    <>
      <div className="flex space-x-4">
      <ReminderAlert/>
       <NoteAlert/>
       
      </div>
    </>
  );
};
