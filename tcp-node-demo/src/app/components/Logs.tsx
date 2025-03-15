"use client";
import { useEffect, useState } from "react";

const Logs = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/logs");
        const result: any[] = await response.json();
        const newLogs = result.filter(
          (newItem) =>
            !data.some(
              (existingItem) =>
                JSON.stringify(existingItem) === JSON.stringify(newItem)
            )
        );
        setData((prev) => [...prev, ...newLogs]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div>
      <h2>Logs</h2>
      <ul>
        {data.map((item, index) => {
          console.log("item", item);
          return (
            <li key={index}>
              {JSON.stringify(item)}{" "}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Logs;
