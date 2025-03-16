"use client";
import { useEffect, useState } from "react";

interface Transaction {
  _id: string;
  amount: number;
  timestamp: string;
  status: string; // e.g., 'pending', 'completed', 'failed'
  currency: String;
  alert: String;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = () => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:5001/api/transactions?filter=${filter}`)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data: Transaction[]) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  return (
    <div>
      <h2>Transactions</h2>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter transactions"
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && (
        <ul>
          {transactions.map((tx) => (
            <li key={tx._id}>{JSON.stringify(tx)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Transactions;
