import React, { useMemo } from "react";
import { LandingForm } from "../components/Form.jsx";
import { Spin } from 'antd';
import useLoading from "../hooks/useLoading.js";

export const StartLogIn = () => {
  const loading = useLoading();
  const MemoizedLandingForm = useMemo(() => <LandingForm />, []);

  return (
    <>
     <div
  className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
  style={{ backgroundImage: "url('backgroundPic4.jpg')" }}
>
    
      {loading ? <Spin size="large" /> : MemoizedLandingForm}
    </div>
    </>
  );
};
