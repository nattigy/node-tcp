// components/Transactions.tsx
"use client";
import { useEffect, useState } from "react";

interface Transaction {
  transaction: Record<string, unknown>;
  alert?: string;
}

const Transactions = () => {
  const [data, setData] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/transactions");
        const result: Transaction[] = await response.json();
        const newTransactions = result.filter(
          (newItem) =>
            !data.some(
              (existingItem) =>
                JSON.stringify(existingItem) === JSON.stringify(newItem)
            )
        );
        setData((prev) => [...prev, ...newTransactions]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div>
      <h2>Transactions</h2>
      <ul>
      {data.map((item, index) => {
          return (
            <li key={index} className={item.alert ? 'text-red-500' : 'text-black'}>
              {JSON.stringify(item)} {item.alert && `- ${item.alert}`}
            </li>
          )
        })}
      </ul>
    </div>
  );
};

export default Transactions;
