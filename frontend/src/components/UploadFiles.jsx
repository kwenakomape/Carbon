import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';

export const UploadFiles = ({
  handleClose,
  memberId,
  autorefresh,
  AppointmentId,
  AppointmentStatus,
  paymentMethod,
}) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file); // Append the file
    });
    formData.append('memberId', memberId);
    formData.append('appointmentId', AppointmentId);
    formData.append('newStatus', AppointmentStatus);
    formData.append('paymentMethod', paymentMethod);

    setUploading(true);

    fetch('/api/upload-invoice', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        setFileList([]);
        message.success('Invoice uploaded successfully.');
        autorefresh();
        handleClose();
      })
      .catch(() => {
        message.error('Upload failed. Please try again.');
        handleClose();
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const uploadProps = {
    onRemove: (file) => {
      const updatedFileList = fileList.filter((f) => f.uid !== file.uid);
      setFileList(updatedFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false; // Prevent automatic upload
    },
    fileList,
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Upload {...uploadProps} style={{ display: 'inline-block' }}>
        <Button icon={<UploadOutlined />}>Select Invoice</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? 'Uploading...' : 'Upload Invoice'}
      </Button>
    </div>
  );
};