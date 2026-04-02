"use client";

import { useEffect, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
import ListView from "./components/ListView";
import DashboardView from "./components/DashboardView";
import Settings from "./components/Settings";

function formatExpenseDate(dateInput) {
  if (!dateInput) return "—";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "—";

  if (isToday(date)) {
    return `Hoje às ${format(date, "HH:mm")}`;
  }

  if (isYesterday(date)) {
    return `Ontem às ${format(date, "HH:mm")}`;
  }

  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export default function Home() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState("Dashboard");

  async function getCategories() {
    try {
      const req = await fetch("/api/categories/");
      const res = await req.json();
      setCategories(res);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async function getExpenses() {
    try {
      const req = await fetch("/api/expenses/");
      const res = await req.json();
      setExpenses(res);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }

  async function addExpense(e) {
    e.preventDefault();

    try {
      await fetch("/api/expenses/", {
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
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  }

  useEffect(() => {
    getExpenses();
    getCategories();
  }, []);

  return (
    <>
      <div className="showArea">
        {view === "Dashboard" && <DashboardView expenses={expenses} categories={categories} />}
        {view === "Lista" && <ListView expenses={expenses} FormatDate={formatExpenseDate} />}
        {view === "Settings" && <Settings categories={categories} />}
      </div>

      <div className="inputArea">
        <div className="menu">
          <button
            style={{
              backgroundColor: view === "Dashboard" ? "whitesmoke" : "transparent",
              color: view === "Dashboard" ? "#202020" : "whitesmoke",
            }}
            onClick={() => setView("Dashboard")}
          >
            Dashboard
          </button>

          <button
            style={{
              backgroundColor: view === "Lista" ? "whitesmoke" : "transparent",
              color: view === "Lista" ? "#202020" : "whitesmoke",
            }}
            onClick={() => setView("Lista")}
          >
            Lista
          </button>

          <button
            style={{
              backgroundColor: view === "Settings" ? "whitesmoke" : "transparent",
              color: view === "Settings" ? "#202020" : "whitesmoke",
            }}
            onClick={() => setView("Settings")}
          >
            Settings
          </button>
        </div>

        <form className="inputContainer" onSubmit={addExpense}>
          <p>Add new expense</p>

          <input type="text" inputMode="decimal" value={amount} placeholder="Enter expense amount" onChange={(e) => setAmount(e.target.value)} required />

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
      </div>
    </>
  );
}
