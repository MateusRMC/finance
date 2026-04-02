"use client";

import { useEffect, useState } from "react";
import { format, formatDate, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import ListView from "./components/ListView";
import DashboardView from "./components/DashboardView";

export default function Home() {
  const [amount, setAmount] = useState(""); //input
  const [category, setCategory] = useState(""); //input

  const [expenses, setExpenses] = useState([]); //fetch
  const [categories, setCategories] = useState([]); //fetch
  const [usage, setUsage] = useState([]); //output

  const [view, setView] = useState("Dashboard"); //view

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
      {view === "Dashboard" && <DashboardView expenses={expenses} categories={categories} FormatDate={FormatDate} />}
      {view === "Lista" && <ListView expenses={expenses} FormatDate={FormatDate} />}
      <div className="menu">
        <button
          style={{
            backgroundColor: view === "Dashboard" ? "whitesmoke" : "transparent",
            color: view === "Dashboard" ? "#202020" : "whitesmoke",
          }}
          onClick={() => {
            setView("Dashboard");
          }}
        >
          Dashboard
        </button>
        <button
          style={{
            backgroundColor: view === "Lista" ? "Whitesmoke" : "transparent",
            color: view === "Lista" ? "#202020" : "whitesmoke",
          }}
          onClick={() => {
            setView("Lista");
          }}
        >
          Lista
        </button>
      </div>
      <form className="inputContainer" onSubmit={addExpense}>
        <p>Add new expense</p>
        <input
          type="text"
          inputMode="decimal"
          step="0.01" //check later how to insure this
          value={amount}
          placeholder="Enter expense amount"
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select className="Categories" value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="" disabled hidden>
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
