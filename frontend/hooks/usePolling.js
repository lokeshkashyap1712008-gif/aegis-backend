"use client";

import { useEffect, useState, useRef } from "react";

export default function usePolling(fetchFn, interval = 3000) {
  const [data, setData] = useState([]);
  const isFetching = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isFetching.current) return; // 🚨 prevent overlap

      isFetching.current = true;

      try {
        const res = await fetchFn();
        setData(res.data);
      } catch (err) {
        console.log("Polling skipped:", err.message);
      } finally {
        isFetching.current = false;
      }
    };

    fetchData();
    const id = setInterval(fetchData, interval);

    return () => clearInterval(id);
  }, [fetchFn]);

  return data;
}