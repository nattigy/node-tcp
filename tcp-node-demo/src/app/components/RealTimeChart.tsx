"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

interface Metric {
  _id: string;
  values: number[];
  metricType: string; // e.g., 'CPU usage', 'memory usage', 'latency'
  timestamp: string;
}

const RealTimeChart = () => {
  const [dataPoints, setDataPoints] = useState<Metric[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);
    fetch(`http://206.81.22.129:5001/api/metrics?filter=${filter}`)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data: Metric[]) => {
        setDataPoints(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchChartData();
    const interval = setInterval(fetchChartData, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  return (
    <Line
      data={{
        labels: dataPoints.map((d) => d.metricType),
        datasets: dataPoints.map((d) => ({
          label: d.metricType,
          data: d.values,
          fill: false,
        })),
      }}
    />
  );
};

export default RealTimeChart;
