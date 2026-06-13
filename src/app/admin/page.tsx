import type { CSSProperties } from "react";
import { adminSecret } from "@/lib/config";
import { readStore } from "@/lib/subscriptions";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ secret?: string }>;

export default async function AdminPage({
  searchParams
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  if (!adminSecret || params.secret !== adminSecret) {
    return (
      <main style={pageStyle}>
        <h1>Доступ закрыт</h1>
        <p>Откройте страницу с параметром <code>?secret=...</code>.</p>
      </main>
    );
  }

  const store = readStore();
  const pendingPayments = Object.values(store.pendingPayments);
  const subscriptions = Object.values(store.subscriptions);

  return (
    <main style={pageStyle}>
      <h1>Breathwork Bot Admin</h1>

      <section>
        <h2>Ожидают проверки оплаты</h2>
        {pendingPayments.length === 0 ? (
          <p>Пока нет заявок на проверку.</p>
        ) : (
          <div style={listStyle}>
            {pendingPayments.map((payment) => (
              <form
                key={payment.user.id}
                data-approve-form=""
                data-user-id={payment.user.id}
                data-secret={params.secret ?? ""}
                style={cardStyle}
              >
                <strong>{displayUser(payment.user)}</strong>
                <span>ID: {payment.user.id}</span>
                <span>Нажал(а): {formatDate(payment.requestedAt)}</span>
                <ApproveButton />
              </form>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Активные подписки</h2>
        {subscriptions.length === 0 ? (
          <p>Пока нет активных подписок.</p>
        ) : (
          <div style={listStyle}>
            {subscriptions.map((subscription) => (
              <div key={subscription.user.id} style={cardStyle}>
                <strong>{displayUser(subscription.user)}</strong>
                <span>ID: {subscription.user.id}</span>
                <span>Доступ до: {formatDate(subscription.activeUntil)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('submit', async (event) => {
              const form = event.target;
              if (!form.matches('[data-approve-form]')) return;
              event.preventDefault();
              const userId = Number(form.dataset.userId);
              const secret = form.dataset.secret;
              const response = await fetch('/api/admin/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, secret })
              });
              if (!response.ok) alert('Не получилось подтвердить оплату');
              else location.reload();
            });
          `
        }}
      />
    </main>
  );
}

function ApproveButton() {
  return (
    <button type="submit" style={buttonStyle}>
      Подтвердить оплату
    </button>
  );
}

function displayUser(user: {
  username?: string;
  firstName?: string;
  lastName?: string;
}) {
  return user.username
    ? `@${user.username}`
    : [user.firstName, user.lastName].filter(Boolean).join(" ") || "Без имени";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Lisbon"
  }).format(new Date(value));
}

const pageStyle = {
  maxWidth: 860,
  margin: "0 auto",
  padding: 32,
  fontFamily: "system-ui, sans-serif"
} satisfies CSSProperties;

const listStyle = {
  display: "grid",
  gap: 12
} satisfies CSSProperties;

const cardStyle = {
  display: "grid",
  gap: 6,
  padding: 16,
  border: "1px solid #ddd",
  borderRadius: 8
} satisfies CSSProperties;

const buttonStyle = {
  width: "fit-content",
  padding: "10px 14px",
  border: 0,
  borderRadius: 6,
  background: "#111",
  color: "#fff",
  cursor: "pointer"
} satisfies CSSProperties;
