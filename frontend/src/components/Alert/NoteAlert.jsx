import { Alert } from "antd";

export const NoteAlert = ({description}) => {
  return (
    <Alert
      message="Note"
      description={description}
      type="info"
      showIcon
      style={{
        marginBottom: "8px",
        maxWidth: "400px",
        padding: "4px 14px",
      }}
    />
  );
};


// "Please ensure that the new dates and times you select do not conflict with any other commitments."