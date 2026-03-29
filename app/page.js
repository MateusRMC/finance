"use client";

import { useEffect, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Home() {
  const [amount, setAmount] = useState(""); //input
  const [category, setCategory] = useState(""); //input

  const [expenses, setExpenses] = useState([]); //fetch
  const [categories, setCategories] = useState([]); //fetch

  function FormatDate(dateInput) {
    if (!dateInput) return "—";

    const date = new Date(dateInput);

    if (isNaN(date.getTime())) return "—";

    if (isToday(date)) {
      return `Hoje às ${format(date, "HH:mm")}`;
    }

    if (isYesterday(date)) {
      return `Ontem às ${format(date, "HH:mm")}`;
    }

    return format(date, "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR,
    });
  }

  async function getCategories() {
    const req = await fetch("/api/categories/");
    const res = await req.json();

    setCategories(res);
  }

  async function getExpenses() {
    const req = await fetch("/api/expenses/");
    const res = await req.json();

    setExpenses(res);
  }

  async function addExpense(e) {
    e.preventDefault();

    const req = await fetch("/api/expenses/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category_id: Number(category),
        amount: parseFloat(amount),
      }),
    });

    setAmount("");
    setCategory("");

    await getExpenses();
  }

  useEffect(() => {
    getExpenses();
    getCategories();
  }, []);

  return (
    <>
      <div className="showExpenses">
        <div className="expenseContainer">
          {expenses.map((expense) => (
            <div className="expenseCard" key={expense.id}>
              <p className="dateLabel">{FormatDate(expense.created_at)}</p>
              <div className="mainInfo">
                <p className="titleLabel">
                  ${Number(expense.amount).toFixed(2)}
                </p>
                <span
                  className="categoryLabel"
                  style={{
                    backgroundColor: expense.category_features?.category_color,
                  }}
                >
                  {expense.category_features?.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <form className="inputExpenses" onSubmit={addExpense}>
        <h3>Add new expense</h3>
        <input
          type="text"
          inputMode="decimal"
          step="0.01" //check later how to insure this
          value={amount}
          placeholder="Enter expense amount"
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select
          className="Categories"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <input type="submit" value="Add expense" />
      </form>
    </>
  );
}
