import { useEffect, useState } from "react";

export const useDelay = (i: number) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), i * 10);

    return () => {
      clearTimeout(timer)
    }
  }, []);

  return ready;
};
