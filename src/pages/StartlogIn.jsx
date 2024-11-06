import { LandingForm } from "../components/Form.jsx";
import { Splash } from "./Splash.jsx";
import React,{ useRef,useState, useEffect } from "react";

export const StartlogIn = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Display splash screen for 3 seconds
  }, []);

  return (
    <>
      {loading ? (
        <Splash />
      ) : (
        <div className="LogInpage">
          <LandingForm />
        </div>
      )}
    </>
  );
};
