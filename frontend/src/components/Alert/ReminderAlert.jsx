import { Alert } from 'antd';

export const ReminderAlert = () => {
  return (
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
  )

}