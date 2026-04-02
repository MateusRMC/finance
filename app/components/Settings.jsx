"use client";

export default function Settings({ categories }) {
  return (
    <>
      <h1>Settings</h1>
      <div className="settingsCategories">
        {categories.map((c) => (
          <div key={c.id} className="categoryCard">
            <p>{c.title}</p>
            <p>{c.budget}</p>
          </div>
        ))}
      </div>
    </>
  );
}
