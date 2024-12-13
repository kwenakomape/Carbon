import React, { useMemo } from "react";
import { LandingForm } from "../components/Form.jsx";
import { Spin } from 'antd';
import useLoading from "../hooks/useLoading.js";

export const StartLogIn = () => {
  const loading = useLoading();
  const MemoizedLandingForm = useMemo(() => <LandingForm />, []);

  return (
    <div className="flex justify-center flex-grow items-center bg-dimBeige">
    
      {loading ? <Spin size="large" /> : MemoizedLandingForm}
    </div>
  );
};
