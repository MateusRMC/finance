import { useState } from "react";

export default function DashboardView({ expenses, categories }) {
  return (
    <div className="showExpenses">
      {categories.map((c) => (
        <div key={c.id} className="categoryCard">
          <p>{c.title}</p>
          <p>32%</p>
          <p>$50</p>
          <p>${c.budget}</p>
        </div>
      ))}
    </div>
  );
}
