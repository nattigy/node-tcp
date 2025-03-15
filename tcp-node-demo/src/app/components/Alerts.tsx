"use client";
import { useEffect, useState } from 'react';

const Alerts = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const client = new WebSocket('ws://localhost:1337');

    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === 'logs') {
        setLogs(data.data);
      }
    };

    return () => client.close();
  }, []);

  return (
    <div>
      <h2>Logs</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{JSON.stringify(log)}</li>
        ))}
      </ul>
    </div>
  );
};

export default Alerts;
