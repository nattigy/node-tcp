"use client";
import Transactions from './Transactions';
import Logs from './Logs';
import RealTimeChart from './RealTimeChart';

const MonitoringDashboard = () => {
  return (
    <div>
      <h1>Monitoring Dashboard</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Transactions />
        <Logs />
      </div>
      <h2>Real-Time Data Visualization</h2>
      <RealTimeChart />
    </div>
  );
};

export default MonitoringDashboard;