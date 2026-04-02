export default function DashboardView({ expenses, categories, view }) {
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
    <div className="showArea">
      {dashCategories.map((c) => (
        <div key={c.id} className="categoryCard">
          <div className="mainInfo">
            <p style={{ backgroundColor: c.category_color, color: "white", padding: "1px 5px", borderRadius: "5px" }}>{c.title}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "5px" }}>
            <p>Used: ${c.total.toFixed(2)}</p>
            <p style={{ color: c.budget - c.total <= 0 ? "Red" : "Green" }}>Left: ${(c.budget - c.total).toFixed(2)}</p>
          </div>
          <div className="mainInfo">
            <p>Budget: ${c.budget.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
