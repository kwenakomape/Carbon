import { Alert } from "antd";

export const NoteAlert = () => {
  return (
    <Alert
      message="Note"
      description="Please ensure that the new dates and times you select do not conflict with any other commitments."
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
