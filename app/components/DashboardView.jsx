"use client";

import { useEffect, useState } from "react";

export default function DashboardView({ expenses, categories, getCategories, getExpenses }) {
  const [daysLeft, setDaysLeft] = useState(null);
  const statementDate = 18;

  function calculateDaysLeft() {
    const now = new Date();
    const day = now.getDate();

    const end = day >= statementDate + 1 ? new Date(now.getFullYear(), now.getMonth() + 1, statementDate + 1) : new Date(now.getFullYear(), now.getMonth(), statementDate + 1);

    return Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  }

  useEffect(() => {
    setDaysLeft(calculateDaysLeft());
    getCategories();
  }, []);

  const totals = {};

  expenses.forEach((e) => {
    if (!e.category_id) return;
    totals[e.category_id] = (totals[e.category_id] || 0) + (Number(e.amount) || 0);
  });

  const dashCategories = categories.map((c) => ({
    ...c,
    total: totals[c.id] || 0,
    budget: Number(c.budget) || 0,
  }));

  const totalBudget = dashCategories.reduce((acc, c) => acc + c.budget, 0);
  const totalUsed = dashCategories.reduce((acc, c) => acc + c.total, 0);

  const rawProgress = totalBudget > 0 ? (totalUsed / totalBudget) * 100 : 0;
  const progress = Math.min(rawProgress, 100);

  function getProgressColor(value) {
    if (value >= 100) return "#ff3b30";
    if (value >= 80) return "#f4b400";
    return "#008f39";
  }

  const progressColor = getProgressColor(rawProgress);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <div className="progressArea">
          <div
            className="progressBar"
            style={{
              width: `${progress}%`,
              backgroundColor: progressColor,
            }}
          >
            <p style={{ color: "white", marginRight: "10px" }}>{rawProgress.toFixed(0)}%</p>
          </div>
        </div>

        <p style={{ color: "white" }}>{daysLeft == null ? "0 dias restantes" : `${daysLeft} dias restantes`}</p>
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
            <p style={{ color: c.budget - c.total < 0 ? "red" : "green" }}>
              {c.budget - c.total >= 0 ? `Left: $${(c.budget - c.total).toFixed(2)}` : `Left: -$${Math.abs(c.budget - c.total).toFixed(2)}`}
            </p>
          </div>

          <div className="mainInfo">
            <p>Budget: ${c.budget.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </>
  );
}
