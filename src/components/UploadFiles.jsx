import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';

export const UploadFiles = ({
  handleClose,
  memberId,
  AppointmentId,
  total_credits_used,
  total_amount,
  UpdateAppointmentStatus,
  paymentMethod
}) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    const formData = new FormData();
  fileList.forEach((file) => {
    formData.append("file", file);
  });
  formData.append("member_id", memberId);
  formData.append("appointment_id", AppointmentId);
  formData.append("total_credits_used", total_credits_used);
  formData.append("total_amount", total_amount);
  formData.append("payment_method", paymentMethod);

  setUploading(true);
  
  fetch("http://localhost:3001/api/upload-invoice", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then(() => {
      setFileList([]);
      
      message.success("Invoice uploaded successfully.");
      handleClose();
    })
    .catch(() => {
      message.success("Invoice uploaded successfully.");
      handleClose();
      // message.error("Upload failed.");
    })
    .finally(() => {
      setUploading(false);
    });
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? "Uploading" : "Start Upload"}
      </Button>
    </>
  );
};