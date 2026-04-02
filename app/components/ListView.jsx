export default function ListView({ expenses, FormatDate }) {
  return (
    <div className="showArea">
      <div className="expenseContainer">
        {expenses.map((expense) => (
          <div className="expenseCard" key={expense.id}>
            <div className="mainInfo">
              <p className="dateLabel">{FormatDate(expense.created_at) + ":"}</p>
              <p className="amountLabel">${Number(expense.amount).toFixed(2)}</p>
            </div>
            <p
              className="categoryLabel"
              style={{
                backgroundColor: expense.category_features?.category_color,
              }}
            >
              {expense.category_features?.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
