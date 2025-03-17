"use client";
import { useEffect, useState } from 'react';

interface Log {
  _id: string;
  message: string;
  level: string; // e.g., 'info', 'warn', 'error'
  timestamp: string;
  source: string; // e.g., 'server', 'database', 'client'
}

const Logs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = () => {
    setLoading(true);
    setError(null);
    fetch(`http://206.81.22.129:5001/api/logs?filter=${filter}`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data: Log[]) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching logs:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  return (
    <div>
      <h2>Logs</h2>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter logs"
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <ul>
          {logs.map((log) => (
            <li key={log._id}>{JSON.stringify(log)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Logs;