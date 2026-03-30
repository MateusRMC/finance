export default function ListView({ expenses, FormatDate }) {
  return (
    <div className="showExpenses">
      <div className="expenseContainer">
        {expenses.map((expense) => (
          <div className="expenseCard" key={expense.id}>
            <div className="mainInfo">
              <h1 className="amountLabel">
                ${Number(expense.amount).toFixed(2)}
              </h1>
              <span
                className="categoryLabel"
                style={{
                  backgroundColor: expense.category_features?.category_color,
                }}
              >
                {expense.category_features?.title}
              </span>
            </div>
            <p className="dateLabel">{FormatDate(expense.created_at)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
