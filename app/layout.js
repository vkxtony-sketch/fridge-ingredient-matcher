export const metadata = {
  title: "Pantry Chef",
  description: "AI-powered recipe recommendation engine"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <main className="max-w-3xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Pantry Chef 🍳</h1>
          {children}
        </main>
      </body>
    </html>
  );
}