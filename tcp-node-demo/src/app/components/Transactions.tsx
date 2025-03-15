// components/Transactions.tsx
"use client";
import { useEffect, useState } from "react";

const Transactions = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/transactions");
        const result: any[] = await response.json();
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
          console.log("item", item);
          return <li key={index}>{JSON.stringify(item)} </li>;
        })}
      </ul>
    </div>
  );
};

export default Transactions;
