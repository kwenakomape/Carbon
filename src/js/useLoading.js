import { useState, useEffect } from 'react';

const useLoading = (initialLoading = true, delay = 500) => {
  const [loading, setLoading] = useState(initialLoading);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, delay);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, [delay]);

  const resetLoading = () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, delay);
    return () => clearTimeout(timer);
  };

  return [loading, setLoading, resetLoading];
};

export default useLoading;