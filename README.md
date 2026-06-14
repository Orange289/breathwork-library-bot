# Breathwork Library Telegram Bot

Next.js webhook app for a Telegram audio library.

## What is included

- `/start` greeting with a button to open practices.
- Free practices: `Баланс`, `Энергия`, `Расслабление`.
- Subscription practice placeholders.
- Payment request flow with `Оплатил/оплатила`.
- Manual admin approval page.
- Local Excel action log with username, date/time, action and button.
- Telegram `protect_content: true` for messages/audio.

Important: Telegram bots cannot fully prevent screenshots. `protect_content` can restrict forwarding/saving in Telegram clients where Telegram supports it, but screenshots are controlled by the user's device.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set:

```bash
TELEGRAM_BOT_TOKEN=...
PUBLIC_BASE_URL=https://your-public-domain.example
ADMIN_SECRET=long-random-secret
```

3. Run locally:

```bash
npm run dev
```

4. Set Telegram webhook after deploying to a public HTTPS URL:

```bash
npm run set-webhook
```

## Admin approval

Open:

```text
/admin?secret=YOUR_ADMIN_SECRET
```

When a user presses `Оплатил/оплатила`, they appear in the pending list. Press `Подтвердить оплату`; the bot sends:

```text
Я получила вашу оплату, теперь вам доступны практики до ... включительно!
```

and sends the practices menu again.

## Files

- Excel log: `data/breathwork-actions.xlsx`
- Subscription data: `data/subscriptions.json`
- Telegram webhook: `src/app/api/telegram/route.ts`
- Approval endpoint: `src/app/api/admin/approve/route.ts`

## Audio files

The three free files are configured through env variables:

```bash
AUDIO_BALANCE_PATH=/Users/orange/Desktop/BREATHWORK/СЕССИИ/короткие/баланс/баланс.mp3
AUDIO_ENERGY_PATH=/Users/orange/Desktop/BREATHWORK/СЕССИИ/живой breathwork/энергия/мягкая-энергия.mp3
AUDIO_RELAXATION_PATH=/Users/orange/Desktop/BREATHWORK/СЕССИИ/живой breathwork/расслабление/расслабление.mp3
AUDIO_SUBSCRIPTION_PRACTICE_1_PATH=
AUDIO_SUBSCRIPTION_PRACTICE_2_PATH=
AUDIO_SUBSCRIPTION_PRACTICE_3_PATH=
```

For deployment, upload the audio files to a server path available to the app and update these variables.
