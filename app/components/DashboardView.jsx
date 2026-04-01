export default function DashboardView({ expenses, categories }) {
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
    <div className="showExpenses">
      {dashCategories.map((c) => (
        <div key={c.id} className="categoryCard">
          <p>{c.title}</p>
          <p>Used: ${c.total.toFixed(2)}</p>
          <p>Left: ${(c.budget - c.total).toFixed(2)}</p>
          <p>Budget: ${c.budget.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
