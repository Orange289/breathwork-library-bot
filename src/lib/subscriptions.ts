import fs from "node:fs";
import path from "node:path";
import { subscriptionsPath } from "./config";
import { addOneMonth } from "./practices";
import type { TelegramUser } from "./types";

export type StoredUser = {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
};

export type PendingPayment = {
  user: StoredUser;
  requestedAt: string;
};

export type Subscription = {
  user: StoredUser;
  activeUntil: string;
  approvedAt: string;
};

type Store = {
  pendingPayments: Record<string, PendingPayment>;
  subscriptions: Record<string, Subscription>;
};

export function userKey(userId: number) {
  return String(userId);
}

export function toStoredUser(user: TelegramUser): StoredUser {
  return {
    id: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name
  };
}

export function readStore(): Store {
  if (!fs.existsSync(subscriptionsPath)) {
    return { pendingPayments: {}, subscriptions: {} };
  }

  return JSON.parse(fs.readFileSync(subscriptionsPath, "utf8")) as Store;
}

export function writeStore(store: Store) {
  fs.mkdirSync(path.dirname(subscriptionsPath), { recursive: true });
  fs.writeFileSync(subscriptionsPath, `${JSON.stringify(store, null, 2)}\n`);
}

export function markPaymentPending(user: TelegramUser) {
  const store = readStore();
  const key = userKey(user.id);

  if (store.pendingPayments[key]) {
    return false;
  }

  store.pendingPayments[key] = {
    user: toStoredUser(user),
    requestedAt: new Date().toISOString()
  };
  writeStore(store);
  return true;
}

export function hasActiveSubscription(userId: number) {
  const store = readStore();
  const subscription = store.subscriptions[userKey(userId)];

  if (!subscription) {
    return false;
  }

  return new Date(subscription.activeUntil).getTime() >= Date.now();
}

export function approveSubscription(userId: number) {
  const store = readStore();
  const key = userKey(userId);
  const pending = store.pendingPayments[key];
  const previousUser = store.subscriptions[key]?.user;
  const activeUntil = addOneMonth();

  store.subscriptions[key] = {
    user: pending?.user ?? previousUser ?? { id: userId },
    activeUntil: activeUntil.toISOString(),
    approvedAt: new Date().toISOString()
  };

  delete store.pendingPayments[key];
  writeStore(store);

  return store.subscriptions[key];
}
