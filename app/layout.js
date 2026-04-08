import "@/app/styles.css";

export const metadata = {
  title: "The Finance App",
  description: "Mastering our finance life",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="main">{children}</div>
      </body>
    </html>
  );
}
