import { LandingForm } from "../components/Form.jsx";
import React, { useState, useEffect, useMemo } from "react";
import { Spin } from 'antd';

export const StartlogIn = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const MemoizedLandingForm = useMemo(() => <LandingForm />, []);

  return (
    <div className="LogInpage">
      {loading ? <Spin size="large" /> : MemoizedLandingForm}
    </div>
  );
};