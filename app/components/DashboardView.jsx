"use client";

import { useEffect, useState } from "react";

export default function DashboardView({ expenses, categories }) {
  const [progress, setProgress] = useState(null);
  const statementDate = 18;

  function calculateProgress() {
    const now = new Date();
    const day = now.getDate();

    const start = day >= statementDate + 1 ? new Date(now.getFullYear(), now.getMonth(), statementDate + 1) : new Date(now.getFullYear(), now.getMonth() - 1, statementDate + 1);

    const end = day >= statementDate + 1 ? new Date(now.getFullYear(), now.getMonth() + 1, statementDate + 1) : new Date(now.getFullYear(), now.getMonth(), statementDate + 1);

    const value = ((now - start) / (end - start)) * 100;
    return Math.min(value, 100);
  }

  useEffect(() => {
    setProgress(calculateProgress());
  }, []);

  const totals = {};
  expenses.forEach((e) => {
    if (!e.category_id) return;
    totals[e.category_id] = (totals[e.category_id] || 0) + (Number(e.amount) || 0);
  });

  const dashCategories = categories.map((c) => ({
    ...c,
    total: totals[c.id] || 0,
  }));

  return (
    <>
      <div className="progressArea">
        <div className="progressBar" style={{ width: `${progress ?? 0}%` }}>
          <p style={{ color: "white", marginRight: "10px" }}>{progress == null ? "0%" : `${progress.toFixed(0)}%`}</p>
        </div>
      </div>

      {dashCategories.map((c) => (
        <div key={c.id} className="categoryCard">
          <div className="mainInfo">
            <p
              style={{
                backgroundColor: c.category_color,
                color: "white",
                padding: "1px 5px",
                borderRadius: "5px",
              }}
            >
              {c.title}
            </p>
          </div>

          <div style={{ padding: "5px" }}>
            <p>Used: ${c.total.toFixed(2)}</p>
            <p style={{ color: c.budget - c.total <= 0 ? "red" : "green" }}>Left: ${(c.budget - c.total).toFixed(2)}</p>
          </div>

          <div className="mainInfo">
            <p>Budget: ${Number(c.budget).toFixed(2)}</p>
          </div>
        </div>
      ))}
    </>
  );
}
