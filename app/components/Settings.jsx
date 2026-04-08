"use client";
import { useEffect, useState } from "react";

export default function Settings({ categories, getCategories, getExpenses }) {
  const [formData, setFormData] = useState(categories);
  const [saving, setSaving] = useState(false);

  function handleChange(id, field, value) {
    setFormData((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  async function handleSave() {
    try {
      setSaving(true);

      const payload = formData.map((item) => ({
        ...item,
        budget: Number(item.budget),
      }));

      const res = await fetch("/api/categories", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    getCategories();
    getExpenses();
  }, []);

  return (
    <>
      <h1>Settings</h1>

      {formData.map((c) => (
        <div key={c.id} className="categoryCard" style={{ flexDirection: "row", padding: "5px 15px" }}>
          <input
            value={c.title}
            onChange={(e) => handleChange(c.id, "title", e.target.value)}
            style={{
              color: c.category_color,
              fontWeight: "bold",
              fontSize: "16px",
              border: "none",
              outline: "none",
              background: "transparent",
            }}
          />

          <div>
            $
            <input
              value={c.budget}
              onChange={(e) => handleChange(c.id, "budget", e.target.value)}
              style={{
                backgroundColor: "whitesmoke",
                fontWeight: "bold",
                fontSize: "16px",
                textAlign: "right",
                color: "black",
                border: "none",
                outline: "none",
              }}
            />
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: "20px 100px",
          margin: "10px",
          backgroundColor: "gray",
          borderRadius: "5px",
          cursor: saving ? "not-allowed" : "pointer",
        }}
      >
        {saving ? "SAVING..." : "SAVE"}
      </button>
    </>
  );
}
