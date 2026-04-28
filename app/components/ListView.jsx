"use client";

import { useEffect, useState } from "react";

export default function ListView({ expenses, categories, FormatDate, getCategories, getExpenses }) {
  const [handleExpenses, setHandleExpenses] = useState(expenses);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setHandleExpenses(expenses);
  }, [expenses]);

  useEffect(() => {
    getCategories();
    getExpenses();
  }, []);

  function openModal(expense) {
    setSelectedExpense({
      ...expense,
      amount: Number(expense.amount).toFixed(2),
      category_id: expense.category_id,
    });
  }

  function closeModal() {
    setSelectedExpense(null);
  }

  function handleModalChange(field, value) {
    setSelectedExpense((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);

      const amount = Number(selectedExpense.amount);
      const category_id = Number(selectedExpense.category_id);

      if (Number.isNaN(amount) || Number.isNaN(category_id)) {
        console.error("Amount ou categoria inválidos");
        return;
      }

      const res = await fetch("/api/expenses", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedExpense.id,
          amount,
          category_id,
        }),
      });

      const data = await res.json();
      console.log(data);

      closeModal();
    } catch (error) {
      console.error("Erro ao salvar expense:", error);
    } finally {
      setSaving(false);
      getExpenses();
      getCategories();
    }
  }

  async function handleDelete() {
    try {
      const res = await fetch("/api/expenses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedExpense.id }),
      });

      const data = await res.json();
      console.log(data);

      setHandleExpenses((prev) => prev.filter((expense) => expense.id !== selectedExpense.id));

      closeModal();
    } catch (error) {
      console.error("Erro ao deletar expense:", error);
    } finally {
      getExpenses();
      getCategories();
    }
  }

  return (
    <>
      <div className="expenseContainer">
        {handleExpenses.map((expense) => (
          <div className="expenseCard" key={expense.id}>
            <div className="expenseParams">
              <p className="dateLabel">{FormatDate(expense.created_at)}</p>

              <p
                className="categoryLabel"
                style={{
                  backgroundColor: expense.category_features?.category_color,
                }}
              >
                {expense.category_features?.title}
              </p>
            </div>

            <div className="amountContainer">
              <p className="amountLabel">${Number(expense.amount).toFixed(2)}</p>

              <img
                style={{ opacity: "60%" }}
                src="/edit.svg"
                className="editExpense"
                onClick={() => openModal(expense)}
              />
            </div>
          </div>
        ))}
      </div>

      {selectedExpense && (
        <div className="modalOverlay">
          <div className="expenseModal">
            <div className="modalHeader">
              <p style={{ fontWeight: "bold", textAlign: "center" }}>Edit expense</p>
              <p className="modalDismissButton" onClick={closeModal}>
                &times;
              </p>
            </div>
            <label>Amount</label>
            <input
              type="text"
              inputMode="decimal"
              value={selectedExpense.amount}
              onChange={(e) => handleModalChange("amount", e.target.value)}
            />

            <label>Category</label>
            <select
              value={selectedExpense.category_id}
              onChange={(e) => handleModalChange("category_id", e.target.value)}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <div className="modalActions">
              <button className="deleteExpense" onClick={handleDelete}>
                Delete expense
              </button>
              <button className="saveExpense" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Expense"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
