export default function HomePage() {
  return (
    <main style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
      <h1>Breathwork Library Bot</h1>
      <p>Telegram webhook endpoint: <code>/api/telegram</code></p>
      <p>Admin page: <code>/admin?secret=...</code></p>
    </main>
  );
}
