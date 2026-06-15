import fs from "node:fs";
import path from "node:path";
import { getStore } from "@netlify/blobs";
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

const STORE_NAME = "subscriptions";
const STORE_KEY = "store";

const emptyStore = (): Store => ({ pendingPayments: {}, subscriptions: {} });

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

// Returns the Netlify Blobs store when the runtime is configured for it
// (i.e. on the deployed site). Falls back to `null` for local development,
// where there is no Blobs context and we use the filesystem instead.
function blobStore() {
  try {
    return getStore(STORE_NAME);
  } catch {
    return null;
  }
}

async function readRaw(): Promise<string | null> {
  const store = blobStore();

  if (store) {
    return (await store.get(STORE_KEY, { type: "text" })) ?? null;
  }

  if (!fs.existsSync(subscriptionsPath)) {
    return null;
  }

  return fs.readFileSync(subscriptionsPath, "utf8");
}

async function writeRaw(raw: string): Promise<void> {
  const store = blobStore();

  if (store) {
    await store.set(STORE_KEY, raw);
    return;
  }

  fs.mkdirSync(path.dirname(subscriptionsPath), { recursive: true });
  fs.writeFileSync(subscriptionsPath, raw);
}

export async function readStore(): Promise<Store> {
  try {
    const rawStore = (await readRaw())?.trim();

    if (!rawStore) {
      return emptyStore();
    }

    const parsedStore = JSON.parse(rawStore) as Partial<Store>;

    return {
      pendingPayments: parsedStore.pendingPayments ?? {},
      subscriptions: parsedStore.subscriptions ?? {}
    };
  } catch (error) {
    console.error("Subscription store read failed", error);
    return emptyStore();
  }
}

export async function writeStore(store: Store): Promise<void> {
  await writeRaw(`${JSON.stringify(store, null, 2)}\n`);
}

export async function markPaymentPending(user: TelegramUser) {
  const store = await readStore();
  const key = userKey(user.id);

  if (store.pendingPayments[key]) {
    return false;
  }

  store.pendingPayments[key] = {
    user: toStoredUser(user),
    requestedAt: new Date().toISOString()
  };
  await writeStore(store);
  return true;
}

export async function hasActiveSubscription(userId: number) {
  const store = await readStore();
  const subscription = store.subscriptions[userKey(userId)];

  if (!subscription) {
    return false;
  }

  return new Date(subscription.activeUntil).getTime() >= Date.now();
}

export async function approveSubscription(userId: number) {
  const store = await readStore();
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
  await writeStore(store);

  return store.subscriptions[key];
}
