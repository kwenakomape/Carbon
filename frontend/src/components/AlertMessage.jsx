import { Alert } from 'antd';

export const AlertMessage = () => {
  return (
    <> <div className="flex space-x-4">
      <Alert
        message="Reminder"
        description="To reschedule, please do so at least 24 hours in advance. Otherwise, credits will be used or payment will be required by the practice."
        type="warning"
        showIcon
        style={{
          marginBottom: "8px",
          maxWidth: "400px",
          padding: "4px 14px",
        }}
      />
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
      </div>
    </>
  );
};
